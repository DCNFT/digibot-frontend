export type ModelProvider =
  | "openai"
  | "google"
  | "anthropic"
  | "mistral"
  | "groq"
  | "perplexity"
  | "ollama"
  | "openrouter"
  | "custom";

export type Models = {
  api_key: string;
  base_url: string;
  context_length: number;
  created_at: string;
  description: string;
  folder_id: string | null;
  id: string;
  model_id: string;
  name: string;
  sharing: string;
  updated_at: string | null;
  user_id: string;
};
