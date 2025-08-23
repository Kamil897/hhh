import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
};

export const Button = ({ children, variant = 'primary', className, ...rest }: ButtonProps) => {
  const base = 'btn';
  const map: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  };
  const styles = `${base} ${map[variant]}`;
  return (
    <button className={`${styles} ${className ?? ''}`} {...rest}>
      {children}
    </button>
  );
};