import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, ...props }: InputProps) {
  return (
    <label className="input-group">
      <span>{label}</span>
      <input id={id} className="input-field" {...props} />
    </label>
  );
}
