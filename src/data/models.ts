import { LLMModel } from '../types';

export const availableModels: LLMModel[] = [
  {
    id: 'moonshotai/moonlight-16b-a3b-instruct:free',
    name: 'Moonshot AI',
    provider: 'OpenRouter',
    costPerInputToken: 0.00000200,
    costPerOutputToken: 0.00000600,
    maxTokens: 32768,
    capabilities: {
      reasoning: 8,
      factual: 8,
      creative: 8,
      coding: 8
    },
    latency: 800,
    specializations: ['balanced performance', 'general tasks', 'reasoning'],
    tier: 'medium'
  },
  {
    id: 'nousresearch/deephermes-3-llama-3-8b-preview:free',
    name: 'Llama 3 8B',
    provider: 'OpenRouter',
    costPerInputToken: 0.00000050,
    costPerOutputToken: 0.00000150,
    maxTokens: 16385,
    capabilities: {
      reasoning: 7,
      factual: 7,
      creative: 7,
      coding: 7
    },
    latency: 500,
    specializations: ['fast responses', 'basic tasks', 'cost-effective'],
    tier: 'low'
  },
  {
    id: 'microsoft/phi-3-mini-128k-instruct:free',
    name: 'Phi 3 Mini',
    provider: 'OpenRouter',
    costPerInputToken: 0.00000050,
    costPerOutputToken: 0.00000150,
    maxTokens: 128000,
    capabilities: {
      reasoning: 7,
      factual: 7,
      creative: 7,
      coding: 7
    },
    latency: 500,
    specializations: ['fast responses', 'basic tasks', 'cost-effective'],
    tier: 'low'
  },
  {
    id: 'microsoft/phi-3-medium-128k-instruct:free',
    name: 'Phi 3 Medium',
    provider: 'OpenRouter',
    costPerInputToken: 0.00000200,
    costPerOutputToken: 0.00000600,
    maxTokens: 128000,
    capabilities: {
      reasoning: 8,
      factual: 8,
      creative: 8,
      coding: 8
    },
    latency: 700,
    specializations: ['balanced performance', 'general tasks', 'coding'],
    tier: 'medium'
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    costPerInputToken: 0.00000100,
    costPerOutputToken: 0.00000300,
    maxTokens: 128000,
    capabilities: {
      reasoning: 10,
      factual: 9,
      creative: 8,
      coding: 10
    },
    latency: 600,
    specializations: ['fast responses', 'coding', 'reasoning'],
    tier: 'medium'
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash-Lite',
    provider: 'Google',
    costPerInputToken: 0.00000075,
    costPerOutputToken: 0.00000225,
    maxTokens: 128000,
    capabilities: {
      reasoning: 8,
      factual: 8,
      creative: 7,
      coding: 8
    },
    latency: 400,
    specializations: ['fast responses', 'efficient', 'cost-effective'],
    tier: 'low'
  },
  {
    id: 'gemini-2.0-flash-experimental',
    name: 'Gemini 2.0 Flash Experimental',
    provider: 'Google',
    costPerInputToken: 0.00000150,
    costPerOutputToken: 0.00000450,
    maxTokens: 128000,
    capabilities: {
      reasoning: 10,
      factual: 10,
      creative: 9,
      coding: 10
    },
    latency: 800,
    specializations: ['advanced features', 'experimental capabilities', 'cutting-edge'],
    tier: 'flagship'
  },
  {
    id: 'mistral-medium',
    name: 'Mistral Medium',
    provider: 'Mistral',
    costPerInputToken: 0.00000267,
    costPerOutputToken: 0.00000800,
    maxTokens: 32768,
    capabilities: {
      reasoning: 9,
      factual: 8,
      creative: 8,
      coding: 9
    },
    latency: 900,
    specializations: ['reasoning', 'coding', 'complex problem solving'],
    tier: 'medium'
  },
  {
    id: 'mistral-small',
    name: 'Mistral Small',
    provider: 'Mistral',
    costPerInputToken: 0.00000200,
    costPerOutputToken: 0.00000600,
    maxTokens: 32768,
    capabilities: {
      reasoning: 7,
      factual: 7,
      creative: 6,
      coding: 7
    },
    latency: 700,
    specializations: ['efficient responses', 'basic tasks'],
    tier: 'low'
  },
  {
    id: 'deepseek/deepseek-r1-distill-llama-70b:free',
    name: 'Deepseek R1',
    provider: 'OpenRouter',
    costPerInputToken: 0.00000200,
    costPerOutputToken: 0.00000600,
    maxTokens: 32768,
    capabilities: {
      reasoning: 9,
      factual: 9,
      creative: 8,
      coding: 9
    },
    latency: 900,
    specializations: ['balanced performance', 'reasoning', 'coding'],
    tier: 'medium'
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'OpenRouter',
    costPerInputToken: 0.00000300,
    costPerOutputToken: 0.00001500,
    maxTokens: 200000,
    capabilities: {
      reasoning: 10,
      factual: 9,
      creative: 9,
      coding: 9
    },
    latency: 1000,
    specializations: ['balanced performance', 'creative writing', 'detailed explanations'],
    tier: 'medium'
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'OpenRouter',
    costPerInputToken: 0.00000025,
    costPerOutputToken: 0.00000125,
    maxTokens: 200000,
    capabilities: {
      reasoning: 7,
      factual: 8,
      creative: 7,
      coding: 7
    },
    latency: 500,
    specializations: ['fast responses', 'efficient', 'cost-effective'],
    tier: 'low'
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'OpenRouter',
    costPerInputToken: 0.00001500,
    costPerOutputToken: 0.00007500,
    maxTokens: 200000,
    capabilities: {
      reasoning: 10,
      factual: 10,
      creative: 10,
      coding: 10
    },
    latency: 1200,
    specializations: ['complex reasoning', 'high accuracy', 'premium performance'],
    tier: 'flagship'
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral',
    costPerInputToken: 0.00000800,
    costPerOutputToken: 0.00002400,
    maxTokens: 32768,
    capabilities: {
      reasoning: 10,
      factual: 9,
      creative: 9,
      coding: 10
    },
    latency: 1100,
    specializations: ['advanced reasoning', 'complex tasks', 'coding excellence'],
    tier: 'flagship'
  },
  {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenRouter',
    costPerInputToken: 0.00001000,
    costPerOutputToken: 0.00003000,
    maxTokens: 128000,
    capabilities: {
      reasoning: 10,
      factual: 10,
      creative: 9,
      coding: 10
    },
    latency: 1000,
    specializations: ['advanced reasoning', 'complex tasks', 'coding excellence'],
    tier: 'flagship'
  },
  {
    id: 'openai/gpt-4-32k',
    name: 'GPT-4 32K',
    provider: 'OpenRouter',
    costPerInputToken: 0.00006000,
    costPerOutputToken: 0.00012000,
    maxTokens: 32768,
    capabilities: {
      reasoning: 10,
      factual: 10,
      creative: 9,
      coding: 10
    },
    latency: 1100,
    specializations: ['long context', 'advanced reasoning', 'premium performance'],
    tier: 'flagship'
  },
  {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenRouter',
    costPerInputToken: 0.00000050,
    costPerOutputToken: 0.00000150,
    maxTokens: 16385,
    capabilities: {
      reasoning: 7,
      factual: 8,
      creative: 7,
      coding: 7
    },
    latency: 500,
    specializations: ['fast responses', 'basic tasks', 'cost-effective'],
    tier: 'low'
  }
];