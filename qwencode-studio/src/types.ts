// Tipos principales para QwenCode Studio

export interface FileItem {
  name: string;
  language: string;
  content?: string;
  path?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  codeBlocks?: CodeBlock[];
}

export interface CodeBlock {
  language: string;
  code: string;
  startLine?: number;
  endLine?: number;
}

export interface TokenBudget {
  dailyLimit: number;
  sessionLimit: number;
  currentUsage: number;
  reservedForCritical: number;
}

export interface AIConfig {
  apiKey?: string;
  model: 'qwen-3.7' | 'qwen-turbo' | 'qwen-max';
  temperature: number;
  maxTokens: number;
  streamEnabled: boolean;
}

export interface EditorSettings {
  fontSize: number;
  minimap: boolean;
  wordWrap: boolean;
  tabSize: number;
  theme: 'vs-dark' | 'vs-light' | 'hc-black';
}

export interface ProjectContext {
  name: string;
  language: string;
  framework?: string;
  conventions: string[];
  files: FileItem[];
}
