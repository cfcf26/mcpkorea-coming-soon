import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyle = 'rounded transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50';
  
  const variantStyles = {
    primary: 'bg-vscode-accent text-white hover:bg-opacity-90 focus:ring-vscode-accent dark:bg-vscode-accent dark:hover:bg-opacity-90',
    secondary: 'bg-transparent border border-vscode-accent text-vscode-accent hover:bg-vscode-accent hover:bg-opacity-10 focus:ring-vscode-accent dark:border-vscode-accent dark:text-vscode-accent',
  };
  
  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  const buttonClass = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`;
  
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button; 