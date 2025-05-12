import React from 'react';
import { Text, TextInput } from '@mantine/core';

export interface PropsQuestion {
  title: string;
  value: string;
  className?: string;
}

const Question: React.FC<PropsQuestion> = ({ title, value, className }) => {
  return (
    <div className={className}>
      <Text fw={500} mb={4}>{title}</Text>
      <TextInput value={value} readOnly disabled aria-label={title} />
    </div>
  );
};

export default Question; 