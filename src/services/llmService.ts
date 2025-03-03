import { GoogleGenerativeAI } from '@google/generative-ai';
import MistralClient from '@mistralai/mistralai';
import axios from 'axios';
import { LLMModel } from '../types';

// Initialize Gemini client
const geminiAI = new GoogleGenerativeAI('AIzaSyCKNgL_b8XdnamBqQq74YMlYnM1wBpYgGs');
const mistralAI = new MistralClient('xHtD1NyIVy6uCsXif5jIRPpApry0zs97');
const openRouterApiKey = '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';

export async function generateResponse(model: LLMModel, prompt: string, signal?: AbortSignal): Promise<string> {
  try {
    if (model.provider === 'Google') {
      try {
        const geminiModel = geminiAI.getGenerativeModel({ model: model.id });
        const result = await geminiModel.generateContent(prompt);
        return result.response.text();
      } catch (error) {
        console.error('Google API error:', error);
        throw new Error('Failed to generate response with Google model. Please try another model.');
      }
    } 
    
    else if (model.provider === 'Mistral') {
      try {
        const response = await mistralAI.chat({
          model: model.id,
          messages: [{ role: 'user', content: prompt }],
          signal
        });
        return response.choices[0].message.content;
      } catch (error) {
        console.error('Mistral API error:', error);
        throw new Error('Failed to generate response with Mistral model. Please try another model.');
      }
    } 
    
    else if (model.provider === 'OpenRouter') {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout
      
      const mergedSignal = { signal: signal || controller.signal };
        
      // Listen for abort from the original signal
      if (signal) {
        signal.addEventListener('abort', () => controller.abort(), { once: true });
      }
      
      try {
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: model.id,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 1024
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openRouterApiKey}`,
              'HTTP-Referer': 'https://llm-router.stackblitz.app',
              'X-Title': 'LLM Router'
            },
            ...mergedSignal,
            timeout: 30000
          }
        );
      
        clearTimeout(timeoutId);
      
        if (response.data?.choices?.[0]?.message?.content) {
          return response.data.choices[0].message.content;
        }
      
        throw new Error('Invalid response format from OpenRouter API');
      } catch (error) {
        console.error('OpenRouter API error:', error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          throw new Error(`Model ${model.name} is not available. Please try another model.`);
        }
        throw new Error('Failed to generate response. Please try another model.');
      }
    }
    
    throw new Error(`Unsupported model provider: ${model.provider}`);
  } catch (error) {
    // Handle abort errors
    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    // Re-throw the error with the message
    throw error;
  }
}