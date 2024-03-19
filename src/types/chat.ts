// import { Tables } from '@/supabase/types';
import { LLMID } from ".";
import { ChatMessage } from "./chatMessage";

export type Message = {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
};

export type Messages = {
  assistant_id: string | null;
  chat_id: string;
  content: string;
  created_at: string;
  id: string;
  image_paths: string[];
  model: string;
  role: string;
  sequence_number: number;
  updated_at: string | null;
  user_id: string;
};

export interface ChatSettings {
  model: LLMID;
  prompt: string;
  temperature: number;
  contextLength: number;
  includeProfileContext: boolean;
  includeWorkspaceInstructions: boolean;
  embeddingsProvider: "openai" | "local";
}

export interface FileItems {
  content: string;
  created_at: string;
  file_id: string;
  id: string;
  level: number | null;
  local_embedding: string | null;
  openai_embedding: string | null;
  sharing: string;
  tokens: number;
  updated_at: string | null;
  user_id: string;
}
export interface ChatPayload {
  chatSettings: ChatSettings;
  workspaceInstructions: string;
  chatMessages: ChatMessage[];
  assistant: Assistants | null;
  messageFileItems: FileItems[];
  chatFileItems: FileItems[];
}

export interface ChatAPIPayload {
  chatSettings: ChatSettings;
  messages: ChatMessage[];
}

export interface Assistants {
  context_length: number;
  created_at: string;
  description: string;
  embeddings_provider: string;
  folder_id: string | null;
  id: string;
  image_path: string;
  include_profile_context: boolean;
  include_workspace_instructions: boolean;
  model: string;
  name: string;
  prompt: string;
  sharing: string;
  temperature: number;
  updated_at: string | null;
  user_id: string;
}
export interface Profiles {
  anthropic_api_key: string | null;
  azure_openai_35_turbo_id: string | null;
  azure_openai_45_turbo_id: string | null;
  azure_openai_45_vision_id: string | null;
  azure_openai_api_key: string | null;
  azure_openai_embeddings_id: string | null;
  azure_openai_endpoint: string | null;
  bio: string;
  created_at: string;
  display_name: string;
  google_gemini_api_key: string | null;
  groq_api_key: string | null;
  has_onboarded: boolean;
  id: string;
  image_path: string;
  image_url: string;
  mistral_api_key: string | null;
  openai_api_key: string | null;
  openai_organization_id: string | null;
  openrouter_api_key: string | null;
  perplexity_api_key: string | null;
  profile_context: string;
  updated_at: string | null;
  use_azure_openai: boolean;
  user_id: string;
  username: string;
}

export interface Workspaces {
  created_at: string;
  default_context_length: number;
  default_model: string;
  default_prompt: string;
  default_temperature: number;
  description: string;
  embeddings_provider: string;
  id: string;
  image_path: string;
  include_profile_context: boolean;
  include_workspace_instructions: boolean;
  instructions: string;
  is_home: boolean;
  name: string;
  sharing: string;
  updated_at: string | null;
  user_id: string;
}

export interface Chats {
  assistant_id: string | null;
  context_length: number;
  created_at: string;
  embeddings_provider: string;
  folder_id: string | null;
  id: string;
  include_profile_context: boolean;
  include_workspace_instructions: boolean;
  model: string;
  name: string;
  prompt: string;
  sharing: string;
  temperature: number;
  updated_at: string | null;
  user_id: string;
  workspace_id: string;
}
