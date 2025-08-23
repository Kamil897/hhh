type InputProps = {
  type?: string;
  placeholder?: string;
};

export const Input = ({ type = 'text', placeholder }: InputProps) => {
  return <input type={type} placeholder={placeholder} className="input" />;
};