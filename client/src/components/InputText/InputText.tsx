import React from 'react';

export interface PropsInputText {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  name?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
  className?: string;
}

const InputText: React.FC<PropsInputText> = ({
  value,
  onChange,
  label,
  placeholder,
  name,
  type = 'text',
  disabled = false,
  required = false,
  ariaLabel,
  className,
  ...rest
}) => {
  const inputId = name || label || ariaLabel || 'input-text';

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId}>
          {label}
          {required && ' *'}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel || label || name}
        {...rest}
      />
    </div>
  );
};

export default InputText; 