import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ type = 'text', className, ...rest }: InputProps) => {
  return <input type={type} className={`input ${className ?? ''}`} {...rest} />;
};