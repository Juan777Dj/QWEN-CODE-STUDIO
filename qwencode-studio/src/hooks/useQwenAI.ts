import { useState, useCallback } from 'react';
import { Message, TokenBudget, AIConfig } from '../types';

export function useQwenAI(initialConfig?: Partial<AIConfig>) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [tokenBudget, setTokenBudget] = useState<TokenBudget>({
    dailyLimit: 10000,
    sessionLimit: 2000,
    currentUsage: 0,
    reservedForCritical: 500,
  });

  const [config, setConfig] = useState<AIConfig>({
    model: 'qwen-3.7',
    temperature: 0.7,
    maxTokens: 2000,
    streamEnabled: true,
    ...initialConfig,
  });

  const buildSystemPrompt = useCallback((context?: any) => {
    return `Eres QwenCode, un asistente experto en programacion integrado en QwenCode Studio.
    
Reglas principales:
1. Se conciso pero completo
2. Muestra codigo primero, explica despues
3. Usa el idioma del usuario (espanol por defecto)
4. Preserva el formato del codigo
5. Optimiza el uso de tokens

Contexto del proyecto:
${context ? JSON.stringify(context, null, 2) : 'No disponible'}

Presupuesto de tokens actual: ${tokenBudget.currentUsage}/${tokenBudget.sessionLimit}`;
  }, [tokenBudget]);

  const sendMessage = useCallback(async (content: string, context?: any) => {
    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      if (tokenBudget.currentUsage >= tokenBudget.sessionLimit) {
        throw new Error('Limite de tokens alcanzado para esta sesion');
      }

      const payload = {
        model: config.model,
        messages: [
          { role: 'system', content: buildSystemPrompt(context) },
          ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content },
        ],
        temperature: config.temperature,
        max_tokens: Math.min(config.maxTokens, tokenBudget.sessionLimit - tokenBudget.currentUsage),
        stream: config.streamEnabled,
      };

      console.log('Enviando a Qwen 3.7:', payload);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '¡Entendido! Estoy listo para ayudarte con tu codigo. Configura tu API key para habilitar la IA.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setTokenBudget(prev => ({ ...prev, currentUsage: prev.currentUsage + 150 }));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `Error: ${errorMessage}`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, config, tokenBudget, buildSystemPrompt]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setTokenBudget(prev => ({ ...prev, currentUsage: 0 }));
    setError(null);
  }, []);

  const updateConfig = useCallback((newConfig: Partial<AIConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  return { messages, isLoading, error, tokenBudget, config, sendMessage, clearHistory, updateConfig };
}
