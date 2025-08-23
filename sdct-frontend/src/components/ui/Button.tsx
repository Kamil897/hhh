type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
};

export const Button = ({ children, variant = 'primary' }: ButtonProps) => {
  const styles = variant === 'primary' ? 'btn btn-primary' : 'btn btn-secondary';
  return <button className={styles}>{children}</button>;
};