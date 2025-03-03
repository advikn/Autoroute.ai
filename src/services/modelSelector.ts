import { LLMModel, PromptAnalysis, ModelSelection } from '../types';
import { availableModels } from '../data/models';

// Decision tree node interface
interface DecisionNode {
  condition: (analysis: PromptAnalysis, winProbabilities: WinProbabilities) => boolean;
  trueNode: DecisionNode | LLMModel;
  falseNode: DecisionNode | LLMModel;
  switchThreshold?: number;
}

// Win probabilities interface
interface WinProbabilities {
  strong: number;  // Gemini Flash, Claude 3 Sonnet
  weak: number;    // Mistral Small, Llama 3 8B
  claude: number;  // Claude 3 models
  lastModelId?: string;
  consecutiveUses?: number;
}

// Track model usage history
let modelUsageHistory = {
  lastModelId: '',
  consecutiveUses: 0,
  switchThreshold: 3 // Max consecutive uses before considering switch
};

// Approximate token count estimation
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.split(/\s+/).length * 1.3);
}

// Calculate win probabilities for each model class
function calculateWinProbabilities(analysis: PromptAnalysis): WinProbabilities {
  const { complexity, taskType, expertiseRequired, accuracyRequirement } = analysis;
  
  // Base probabilities adjusted by task type
  let probabilities = {
    strong: 0.7,
    weak: 0.3,
    claude: 0.5,
    lastModelId: modelUsageHistory.lastModelId,
    consecutiveUses: modelUsageHistory.consecutiveUses
  };
  
  // Adjust for task type with more aggressive adjustments
  switch (taskType) {
    case 'coding':
      probabilities.strong *= 1.5;
      probabilities.claude *= 1.1;
      probabilities.weak *= 0.7;
      break;
    case 'creative':
      probabilities.claude *= 1.4;
      probabilities.strong *= 1.2;
      probabilities.strong *= 1.1;
      probabilities.weak *= 0.8;
      break;
    case 'factual':
      probabilities.weak *= 1.3;
      probabilities.claude *= 1.1;
      probabilities.strong *= 0.8;
      break;
    case 'reasoning':
      probabilities.strong *= 1.4;
      probabilities.strong *= 1.5;
      probabilities.claude *= 1.2;
      probabilities.weak *= 0.7;
      break;
  }
  
  // Adjust for complexity with stronger bias
  if (complexity >= 8) {
    probabilities.strong *= 1.5;
    probabilities.weak *= 0.5;
  } else if (complexity <= 3) {
    probabilities.weak *= 1.4;
    probabilities.strong *= 0.6;
  }
  
  // Encourage model switching after consecutive uses
  if (modelUsageHistory.consecutiveUses >= modelUsageHistory.switchThreshold) {
    const currentModel = modelUsageHistory.lastModelId;
    if (currentModel.includes('gpt')) {
      probabilities.claude *= 1.3;
      probabilities.strong *= 0.8;
    } else if (currentModel.includes('claude')) {
      probabilities.strong *= 1.3;
      probabilities.claude *= 0.8;
    }
  }
  
  // Normalize probabilities
  const total = Object.values(probabilities).reduce((a, b) => 
    typeof b === 'number' ? a + b : a, 0
  );
  
  Object.keys(probabilities).forEach(key => {
    if (typeof probabilities[key as keyof WinProbabilities] === 'number') {
      probabilities[key as keyof WinProbabilities] = 
        (probabilities[key as keyof WinProbabilities] as number) / total;
    }
  });
  
  return probabilities;
}

// Enhanced decision tree with more branching
const decisionTree: DecisionNode = {
  condition: (analysis, _) => analysis.taskType === 'general',
  trueNode: {
    condition: (analysis, _) => analysis.complexity <= 5,
    trueNode: availableModels.find(m => m.id === 'deepseek/deepseek-r1-distill-llama-70b:free')!,
    falseNode: {
      condition: (analysis, _) => analysis.accuracyRequirement >= 8,
      trueNode: availableModels.find(m => m.id === 'anthropic/claude-3-opus')!,
      falseNode: availableModels.find(m => m.id === 'deepseek/deepseek-r1-distill-llama-70b:free')!
    }
  },
  falseNode: {
    condition: (analysis, _) => analysis.complexity >= 8 || analysis.accuracyRequirement >= 8,
    trueNode: {
      condition: (analysis, _) => analysis.taskType === 'coding' || analysis.taskType === 'reasoning',
      trueNode: availableModels.find(m => m.id === 'anthropic/claude-3-opus')!,
      falseNode: availableModels.find(m => m.id === 'anthropic/claude-3-sonnet')!
    },
    falseNode: {
      condition: (analysis, _) => analysis.taskType === 'creative',
      trueNode: availableModels.find(m => m.id === 'anthropic/claude-3-sonnet')!,
      falseNode: {
        condition: (analysis, _) => analysis.complexity <= 3,
        trueNode: availableModels.find(m => m.id === 'anthropic/claude-3-haiku')!,
        falseNode: availableModels.find(m => m.id === 'mistral-medium')!
      }
    }
  }
};

// Traverse decision tree to select model
function traverseDecisionTree(node: DecisionNode | LLMModel, analysis: PromptAnalysis, winProbabilities: WinProbabilities): LLMModel {
  if ('id' in node) {
    return node;
  }
  
  const result = node.condition(analysis, winProbabilities);
  return traverseDecisionTree(
    result ? node.trueNode : node.falseNode,
    analysis,
    winProbabilities
  );
}

// Update model usage history
function updateModelUsageHistory(selectedModel: LLMModel) {
  if (selectedModel.id === modelUsageHistory.lastModelId) {
    modelUsageHistory.consecutiveUses++;
  } else {
    modelUsageHistory.lastModelId = selectedModel.id;
    modelUsageHistory.consecutiveUses = 1;
  }
}

// Calculate estimated cost
export function calculateEstimatedCost(
  model: LLMModel, 
  inputTokens: number, 
  estimatedOutputTokens: number
): number {
  return (
    inputTokens * model.costPerInputToken + 
    estimatedOutputTokens * model.costPerOutputToken
  );
}

// Calculate model score for a given prompt analysis
function calculateModelScore(model: LLMModel, analysis: PromptAnalysis): number {
  let score = 0;
  
  // Match task type with model capabilities
  switch (analysis.taskType) {
    case 'general':
      // For general queries, prioritize Deepseek
      if (model.name.includes('Deepseek')) {
        score += 15; // Give strong preference to Deepseek
      }
      score += model.capabilities.factual * 2;
      break;
    case 'reasoning':
      score += model.capabilities.reasoning * 2;
      break;
    case 'creative':
      score += model.capabilities.creative * 2;
      break;
    case 'coding':
      score += model.capabilities.coding * 2;
      break;
    case 'mixed':
      score += (
        model.capabilities.factual + 
        model.capabilities.reasoning + 
        model.capabilities.creative + 
        model.capabilities.coding
      ) / 2;
      break;
  }
  
  // Match complexity with model capabilities
  const complexityScore = analysis.complexity <= 5 ? 
    10 - Math.abs(5 - model.capabilities.reasoning) : 
    model.capabilities.reasoning;
  score += complexityScore;
  
  // Match expertise required
  score += Math.min(10, model.capabilities.reasoning + model.capabilities.factual) * 
    (analysis.expertiseRequired / 10);
  
  // Consider time sensitivity
  if (analysis.timeSensitivity === 'high') {
    // Faster models get higher scores
    score += (2000 - model.latency) / 200; // Max 10 points for very fast models
  }
  
  // Consider accuracy requirements
  if (analysis.accuracyRequirement >= 8) {
    // More capable models for high accuracy tasks
    score += model.capabilities.factual;
  }
  
  // Domain specialization bonus
  if (model.specializations.some(spec => spec.toLowerCase().includes(analysis.domain))) {
    score += 5;
  }
  
  return score;
}

export function selectModel(prompt: string, analysis: PromptAnalysis): ModelSelection {
  const inputTokens = estimateTokenCount(prompt);
  const winProbabilities = calculateWinProbabilities(analysis);
  const manuallySelectedModelId = localStorage.getItem('selectedModelId');
  
  // Estimate output tokens based on expected response length
  const outputTokenMultiplier = 
    analysis.expectedResponseLength === 'short' ? 2 :
    analysis.expectedResponseLength === 'medium' ? 5 : 10;
  const estimatedOutputTokens = inputTokens * outputTokenMultiplier;
  
  // If a model is manually selected, use it instead of the decision tree
  const selectedModel = manuallySelectedModelId
    ? availableModels.find(m => m.id === manuallySelectedModelId)!
    : traverseDecisionTree(decisionTree, analysis, winProbabilities);
  
  // Update usage history
  updateModelUsageHistory(selectedModel);
  
  // Calculate cost for selected model
  const estimatedCost = calculateEstimatedCost(selectedModel, inputTokens, estimatedOutputTokens);
  
  // Calculate confidence score based on win probabilities
  let confidenceScore = 0;
  
  // Set high confidence for manually selected models
  if (manuallySelectedModelId) {
    confidenceScore = 1.0; // Maximum confidence for manual selection
  } else if (analysis.complexity >= 8) {
    confidenceScore = selectedModel.id === 'anthropic/claude-3-opus' ? 0.98 :
                     selectedModel.id === 'anthropic/claude-3-sonnet' ? 0.95 :
                     selectedModel.id === 'mistral-medium' ? 0.88 : 0.80;
  } else if (analysis.complexity <= 3) {
    confidenceScore = selectedModel.id === 'anthropic/claude-3-haiku' ? 0.95 :
                     selectedModel.id === 'mistral-small' ? 0.9 : 0.85;
  } else {
    confidenceScore = selectedModel.id === 'anthropic/claude-3-sonnet' ? 0.9 :
                     selectedModel.id === 'mistral-medium' ? 0.85 : 0.8;
  }
  
  // Adjust confidence based on task type match
  const taskTypeMatch = getTaskTypeScore(selectedModel, analysis.taskType) / 15;
  confidenceScore = (confidenceScore + taskTypeMatch) / 2;

  // Boost confidence for Deepseek on general queries
  if (analysis.taskType === 'general' && selectedModel.name.includes('Deepseek')) {
    confidenceScore = Math.min(confidenceScore + 0.1, 1.0);
  }
  
  // Generate detailed reasoning
  let reasoning = `Selected ${selectedModel.name} (${selectedModel.provider}) for this ${analysis.taskType} task.\n\n`;
  
  // Add manual selection note if applicable
  if (manuallySelectedModelId) {
    reasoning = `Using manually selected model: ${selectedModel.name} (${selectedModel.provider}).\n\n`;
  }
  
  // Add detailed task-specific reasoning
  switch (analysis.taskType) {
    case 'coding':
      reasoning += `This is a coding-focused task with complexity ${analysis.complexity}/10. ${
        analysis.complexity >= 7 
          ? 'Due to the high complexity and specialized requirements, selecting a model with advanced coding capabilities and technical expertise.'
          : 'Selecting a model with strong coding abilities while maintaining cost efficiency.'
      }\n\n`;
      break;
    case 'creative':
      reasoning += `This is a creative writing/generation task with complexity ${analysis.complexity}/10. ${
        analysis.complexity >= 7
          ? 'Due to the advanced creative requirements, selecting a model with exceptional creative and narrative capabilities.'
          : 'Choosing a model that balances creative abilities with cost optimization.'
      }\n\n`;
      break;
    case 'general':
      reasoning += `This is a general query with complexity ${analysis.complexity}/10. ${
        analysis.complexity <= 3
          ? 'For straightforward general queries, using Deepseek for optimal performance.'
          : 'Selecting Deepseek for comprehensive and accurate responses.'
      }\n\n`;
      break;
    case 'reasoning':
      reasoning += `This is an analytical reasoning task with complexity ${analysis.complexity}/10. ${
        analysis.complexity >= 7
          ? 'Due to the complex analysis required, selecting a model with superior reasoning and analytical capabilities.'
          : 'Choosing a model that provides strong reasoning abilities while maintaining cost efficiency.'
      }\n\n`;
      break;
    default:
      reasoning += `This is a multi-faceted task with complexity ${analysis.complexity}/10. Selecting a versatile model with balanced capabilities.\n\n`;
  }
  
  // Add cost details
  reasoning += `Estimated cost: $${estimatedCost.toFixed(6)} (${inputTokens} input tokens, ~${estimatedOutputTokens} output tokens).\n\n`;
  
  // Add selection criteria
  reasoning += `Selection criteria:\n`;
  reasoning += `• Task type: ${analysis.taskType}\n`;
  reasoning += `• Complexity: ${analysis.complexity}/10\n`;
  reasoning += `• Expertise required: ${analysis.expertiseRequired}/10\n`;
  reasoning += `• Accuracy requirement: ${analysis.accuracyRequirement}/10\n\n`;
  
  reasoning += `Win probabilities:\n`;
  reasoning += `• Strong models (Gemini Ultra/Pro): ${(winProbabilities.strong * 100).toFixed(1)}%\n`;
  reasoning += `• Claude 3 models: ${(winProbabilities.claude * 100).toFixed(1)}%\n`;
  reasoning += `• Weak models: ${(winProbabilities.weak * 100).toFixed(1)}%\n`;
  
  // Get alternatives based on win probabilities
  const alternatives = availableModels
    .filter(m => m.id !== selectedModel.id)
    .sort((a, b) => {
      const aProb = getModelClassProbability(a, winProbabilities);
      const bProb = getModelClassProbability(b, winProbabilities);
      return bProb - aProb;
    })
    .slice(0, 3);
  
  return {
    selectedModel,
    estimatedCost,
    confidenceScore,
    alternatives,
    reasoning,
    tokenEstimates: {
      input: inputTokens,
      estimatedOutput: estimatedOutputTokens
    }
  };
}

// Helper function to get win probability for a specific model
function getModelClassProbability(model: LLMModel, probs: WinProbabilities): number {
  if (model.id.includes('gemini-2.0') || model.id === 'anthropic/claude-3-sonnet') return probs.strong;
  if (model.id.includes('claude')) return probs.claude;
  return probs.weak;
}

// Helper function to get task type score
function getTaskTypeScore(model: LLMModel, taskType: string): number {
  switch (taskType) {
    case 'factual':
      return model.capabilities.factual * 2;
    case 'reasoning':
      return model.capabilities.reasoning * 2;
    case 'creative':
      return model.capabilities.creative * 2;
    case 'coding':
      return model.capabilities.coding * 2;
    case 'mixed':
      return (
        model.capabilities.factual + 
        model.capabilities.reasoning + 
        model.capabilities.creative + 
        model.capabilities.coding
      ) / 2;
    default:
      return 0;
  }
}