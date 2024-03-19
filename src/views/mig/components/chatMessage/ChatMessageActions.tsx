import { IconCheck, IconCopy, IconEdit, IconRepeat } from '@tabler/icons-react';
import { FC, useContext, useEffect, useState } from 'react';
import { WithTooltip } from '@/components/ui/withTooltip';
import useChatStore from '@/store/useChatStore';

export const MESSAGE_ICON_SIZE = 18;

interface MessageActionsProps {
  isAssistant: boolean;
  isLast?: boolean;
  isEditing?: boolean;
  isHovering: boolean;
  onCopy: () => void;
  onEdit?: () => void;
  onRegenerate?: () => void;
}

export const ChatMessageActions: FC<MessageActionsProps> = ({
  isAssistant,
  isLast,
  isEditing,
  isHovering,
  onCopy,
  onEdit,
  onRegenerate,
}) => {
  const isGenerating = useChatStore((state) => state.isGenerating);
  const [showCheckmark, setShowCheckmark] = useState(false);

  const handleCopy = () => {
    onCopy();
    setShowCheckmark(true);
  };

  useEffect(() => {
    if (showCheckmark) {
      const timer = setTimeout(() => {
        setShowCheckmark(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showCheckmark]);

  return isGenerating || !isAssistant ? null : (
    <div className="text-muted-foreground flex items-center space-x-2">
      {/* {!isAssistant && isHovering && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Edit</div>}
          trigger={
            <IconEdit
              className="cursor-pointer hover:opacity-50"
              size={MESSAGE_ICON_SIZE}
              onClick={onEdit}
            />
          }
        />
      )} */}

      {(isHovering || isLast) && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Copy</div>}
          trigger={
            showCheckmark ? (
              <IconCheck size={MESSAGE_ICON_SIZE} />
            ) : (
              <IconCopy
                className="cursor-pointer hover:opacity-50"
                size={MESSAGE_ICON_SIZE}
                onClick={handleCopy}
              />
            )
          }
        />
      )}

      {isLast && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Regenerate</div>}
          trigger={
            <IconRepeat
              className="cursor-pointer hover:opacity-50"
              size={MESSAGE_ICON_SIZE}
              onClick={onRegenerate}
            />
          }
        />
      )}
    </div>
  );
};
