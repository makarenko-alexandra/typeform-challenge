import React from 'react';
import { Text, TextInput, ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

export interface PropsQuestion {
  title: string;
  value: string;
  className?: string;
  readonly?: boolean;
  onRemove?: () => void;
  onTitleChange?: (newTitle: string) => void;
}

const Question: React.FC<PropsQuestion> = ({ title, value, className, readonly, onRemove, onTitleChange }) => {
  const spanRef = React.useRef<HTMLSpanElement>(null);

  const handleEditEnd = () => {
    if (onTitleChange && spanRef.current) {
      const newTitle = spanRef.current.textContent || '';
      if (newTitle.trim() && newTitle !== title) {
        onTitleChange(newTitle.trim());
      } else {
        spanRef.current.textContent = title; // revert if unchanged or empty
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      spanRef.current?.blur();
    } else if (e.key === 'Escape') {
      if (spanRef.current) spanRef.current.textContent = title;
      spanRef.current?.blur();
    }
  };

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 48 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        {readonly && onTitleChange ? (
          <span
            ref={spanRef}
            contentEditable
            suppressContentEditableWarning
            tabIndex={0}
            aria-label="Edit question title"
            style={{
              outline: 'none',
              borderRadius: 4,
              padding: '2px 4px',
              minWidth: 40,
              fontWeight: 500,
              marginBottom: 4,
              cursor: 'text',
            }}
            onBlur={handleEditEnd}
            onKeyDown={handleKeyDown}
            spellCheck={false}
          >
            {title}
          </span>
        ) : (
          <Text fw={500} mb={4}>{title}</Text>
        )}
        {readonly && onRemove && (
          <ActionIcon
            variant="subtle"
            color="red"
            aria-label="Remove question"
            onClick={onRemove}
            tabIndex={0}
          >
            <IconTrash size={16} />
          </ActionIcon>
        )}
      </div>
      <TextInput value={value} readOnly disabled aria-label={title} style={{ flex: 1 }} />
    </div>
  );
};

export default Question; 