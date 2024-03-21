'use client';

import { CHAT_SETTING_LIMITS } from '@/lib/chat-setting-limits';
import { LLM_LIST } from '@/lib/models/llm/llm-list';
import { ChatSettings } from '@/types';
import { IconInfoCircle } from '@tabler/icons-react';
import { FC, useContext } from 'react';
import { ModelSelect } from '@/components/models/model-select';
import { Checkbox } from './checkbox';
import { Label } from './label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { TextareaAutosize } from './textareaAutosize';
import useChatStore from '@/store/useChatStoreMig';

interface ChatSettingsFormProps {
  chatSettings: ChatSettings;
  onChangeChatSettings: (value: ChatSettings) => void;
  useAdvancedDropdown?: boolean;
  showTooltip?: boolean;
}

export const ChatSettingsForm: FC<ChatSettingsFormProps> = ({
  chatSettings,
  onChangeChatSettings,
}) => {
  const profile = useChatStore((state) => state.profile);
  if (!profile) return null;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>Model</Label>

        <ModelSelect
          hostedModelOptions={LLM_LIST}
          // localModelOptions={availableLocalModels}
          selectedModelId={chatSettings.model}
          onSelectModel={(model) => {
            onChangeChatSettings({ ...chatSettings, model });
          }}
        />
      </div>

      <div className="space-y-1">
        <Label>Prompt</Label>

        <TextareaAutosize
          className="bg-background border-input border-2"
          placeholder="You are a helpful AI assistant."
          onValueChange={(prompt) => {
            onChangeChatSettings({ ...chatSettings, prompt });
          }}
          value={chatSettings.prompt}
          minRows={3}
          maxRows={6}
        />
      </div>
    </div>
  );
};
