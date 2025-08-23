import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export const Button = ({ children, variant = 'primary', className, ...rest }: ButtonProps) => {
  const styles = variant === 'primary' ? 'btn btn-primary' : 'btn btn-secondary';
  return (
    <button className={`${styles} ${className ?? ''}`} {...rest}>
      {children}
    </button>
  );
};