export interface LLMModel {
  id: string;
  name: string;
  provider: 'Google' | 'Mistral' | 'Nebius' | 'OpenRouter';
  costPerInputToken: number;
  costPerOutputToken: number;
  maxTokens: number;
  capabilities: {
    reasoning: number; // 1-10
    factual: number; // 1-10
    creative: number; // 1-10
    coding: number; // 1-10
  };
  latency: number; // average ms response time
  specializations: string[];
  tier: 'low' | 'medium' | 'flagship'; // Model tier categorization
}

export interface PromptAnalysis {
  complexity: number; // 1-10
  expertiseRequired: number; // 1-10
  expectedResponseLength: 'short' | 'medium' | 'long';
  timeSensitivity: 'low' | 'medium' | 'high';
  accuracyRequirement: number; // 1-10
  domain: string;
  taskType: 'general' | 'reasoning' | 'creative' | 'coding' | 'mixed';
}

export interface ModelSelection {
  selectedModel: LLMModel;
  estimatedCost: number;
  confidenceScore: number;
  alternatives: LLMModel[];
  reasoning: string;
  scoringDetails?: {
    taskTypeScore: number;
    complexityScore: number;
    expertiseScore: number;
    timeScore: number;
    accuracyScore: number;
    domainBonus: number;
  };
  tokenEstimates?: {
    input: number;
    estimatedOutput: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: Date;
  estimatedCost?: number;
}

export type SelectionMode = 'auto' | 'manual';