import { PromptAnalysis } from '../types';

// Simple keyword-based analysis
const domainKeywords = {
  coding: ['code', 'function', 'programming', 'javascript', 'python', 'algorithm', 'debug'],
  science: ['science', 'physics', 'chemistry', 'biology', 'scientific', 'experiment'],
  math: ['math', 'equation', 'calculation', 'formula', 'solve', 'calculus', 'algebra'],
  creative: ['story', 'creative', 'imagine', 'design', 'art', 'write', 'poem', 'fiction'],
  business: ['business', 'marketing', 'finance', 'strategy', 'company', 'startup', 'market'],
  general: ['explain', 'what is', 'how to', 'why', 'when', 'where', 'who']
};

const taskTypeKeywords = {
  general: ['what is', 'define', 'explain', 'describe', 'list', 'when did', 'who is'],
  reasoning: ['why', 'analyze', 'compare', 'evaluate', 'how would', 'what if', 'reason'],
  creative: ['create', 'design', 'write', 'imagine', 'generate', 'story', 'poem'],
  coding: ['code', 'function', 'program', 'implement', 'debug', 'fix', 'optimize']
};

export function analyzePrompt(prompt: string): PromptAnalysis {
  const lowerPrompt = prompt.toLowerCase();
  const wordCount = prompt.split(' ').length;
  
  // Determine domain
  let domain = 'general';
  let maxDomainMatches = 0;
  
  Object.entries(domainKeywords).forEach(([key, keywords]) => {
    const matches = keywords.filter(keyword => lowerPrompt.includes(keyword)).length;
    if (matches > maxDomainMatches) {
      maxDomainMatches = matches;
      domain = key;
    }
  });
  
  // Determine task type
  let taskType: 'general' | 'reasoning' | 'creative' | 'coding' | 'mixed' = 'mixed';
  let maxTaskTypeMatches = 0;
  let taskTypeConfidence = 0;
  
  Object.entries(taskTypeKeywords).forEach(([key, keywords]) => {
    const matches = keywords.filter(keyword => lowerPrompt.includes(keyword)).length;
    if (matches > maxTaskTypeMatches) {
      maxTaskTypeMatches = matches;
      taskType = key as any;
      taskTypeConfidence = matches / keywords.length;
    }
  });
  
  // Additional task type detection logic
  if (lowerPrompt.includes('code') || lowerPrompt.includes('function') || lowerPrompt.includes('program')) {
    taskType = 'coding';
    taskTypeConfidence = 0.9;
  } else if (lowerPrompt.includes('write') && (lowerPrompt.includes('story') || lowerPrompt.includes('poem'))) {
    taskType = 'creative';
    taskTypeConfidence = 0.9;
  } else if (lowerPrompt.includes('what') || lowerPrompt.includes('who') || lowerPrompt.includes('when')) {
    taskType = 'general';
    taskTypeConfidence = 0.85;
  } else if (lowerPrompt.includes('why') || lowerPrompt.includes('how') || lowerPrompt.includes('explain')) {
    taskType = 'reasoning';
    taskTypeConfidence = 0.85;
  }
  
  // Complexity based on prompt length and question structure
  let complexity = Math.min(10, Math.max(1, Math.floor(wordCount / 12)));
  
  // Adjust complexity based on task type
  if (taskType === 'coding') {
    complexity = Math.max(complexity, 7); // Coding tasks have higher minimum complexity
    // Additional complexity for specific coding keywords
    if (lowerPrompt.includes('algorithm') || lowerPrompt.includes('optimize')) complexity += 2;
    if (lowerPrompt.includes('class') || lowerPrompt.includes('interface')) complexity += 1;
  } else if (taskType === 'reasoning') {
    complexity = Math.max(complexity, 6);
    // Additional complexity for advanced reasoning
    if (lowerPrompt.includes('analyze') || lowerPrompt.includes('evaluate')) complexity += 2;
    if (lowerPrompt.includes('compare') || lowerPrompt.includes('contrast')) complexity += 1;
  } else if (taskType === 'creative') {
    // Adjust complexity based on creative task requirements
    if (lowerPrompt.includes('story') || lowerPrompt.includes('poem')) complexity += 1;
    if (lowerPrompt.includes('novel') || lowerPrompt.includes('innovative')) complexity += 2;
  } else if (taskType === 'general') {
    // Simple factual queries have lower complexity
    complexity = Math.min(complexity, 4);
    if (lowerPrompt.includes('explain') || lowerPrompt.includes('describe')) {
      complexity = Math.min(complexity + 2, 6);
    }
  }
  
  // Adjust complexity based on domain
  if (domain === 'coding' || domain === 'science' || domain === 'math') {
    complexity = Math.min(10, complexity + 2);
  }
  
  // Adjust complexity based on keywords indicating complexity
  const complexityKeywords = [
    'analyze', 'evaluate', 'compare', 'synthesize', 'optimize',
    'design', 'implement', 'architect', 'debug', 'solve'
  ];
  
  const complexityMatches = complexityKeywords.filter(keyword => 
    lowerPrompt.includes(keyword)
  ).length;
  
  complexity = Math.min(10, complexity + complexityMatches);
  
  // Expertise required based on domain and complexity
  let expertiseRequired = domain === 'general' ? Math.min(complexity + 1, 10) : Math.min(complexity + 3, 10);
  
  // Adjust expertise required based on task type
  if (taskType === 'coding') expertiseRequired = Math.max(expertiseRequired, 7);
  if (taskType === 'reasoning' && complexity >= 7) expertiseRequired = Math.max(expertiseRequired, 8);
  
  // Expected response length
  let expectedResponseLength: 'short' | 'medium' | 'long' = 'medium';
  if (wordCount < 10) {
    expectedResponseLength = 'short';
  } else if (wordCount > 30) {
    expectedResponseLength = 'long';
  }
  
  // Time sensitivity - default to medium
  const timeSensitivity = lowerPrompt.includes('urgent') || lowerPrompt.includes('quickly') ? 
    'high' : lowerPrompt.includes('when you have time') ? 'low' : 'medium';
  
  // Enhanced accuracy requirement calculation
  let accuracyRequirement = 6; // Base accuracy requirement
  
  // Adjust based on domain
  if (domain === 'coding' || domain === 'math' || domain === 'science') {
    accuracyRequirement = 9;
  }
  
  // Adjust based on task type
  if (taskType === 'general') accuracyRequirement = Math.max(accuracyRequirement, 8);
  if (taskType === 'reasoning' && complexity >= 7) accuracyRequirement = Math.max(accuracyRequirement, 8);
  
  // Adjust based on keywords indicating high accuracy needs
  if (
    lowerPrompt.includes('accurate') ||
    lowerPrompt.includes('precise') ||
    lowerPrompt.includes('exact') ||
    lowerPrompt.includes('critical') ||
    lowerPrompt.includes('important')
  ) {
    accuracyRequirement = Math.max(accuracyRequirement, 8);
  }
  
  return {
    complexity,
    expertiseRequired,
    expectedResponseLength,
    timeSensitivity,
    accuracyRequirement,
    domain,
    taskType
  };
}