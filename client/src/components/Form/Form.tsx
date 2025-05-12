import React from 'react';

export interface PropsForm {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  autoComplete?: string;
}

const Form: React.FC<PropsForm> = ({
  onSubmit,
  children,
  className,
  ariaLabel,
  autoComplete,
  ...rest
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={className}
      aria-label={ariaLabel}
      role="form"
      autoComplete={autoComplete}
      {...rest}
    >
      {children}
    </form>
  );
};

export default Form; 