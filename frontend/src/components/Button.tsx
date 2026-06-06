import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  href?: string;
}

const classMap = {
  primary: 'button-primary',
  secondary: 'button-secondary',
  danger: 'button-danger',
} as const;

export function Button({ label, variant = 'primary', disabled, href, ...props }: ButtonProps) {
  const className = `button ${classMap[variant]}`;

  if (href) {
    return (
      <a className={className} href={href}>
        {label}
      </a>
    );
  }

  return (
    <button className={className} disabled={disabled} {...props}>
      {label}
    </button>
  );
}
