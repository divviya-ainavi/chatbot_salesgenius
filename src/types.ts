export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ApiResponse {
  response: string;
}