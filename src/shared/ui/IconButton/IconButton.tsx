import React from 'react';
import styles from './IconButton.module.scss';

export interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  className?: string;
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  variant = 'primary',
  size = 'md',
  title,
  className = '',
  disabled = false,
}) => {
  const variantClass = styles[`iconButton--${variant}`];
  const sizeClass = styles[`iconButton--${size}`];
  const disabledClass = disabled ? styles['iconButton--disabled'] : '';

  return (
    <button
      className={`${styles.iconButton} ${variantClass} ${sizeClass} ${disabledClass} ${className}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
      type="button"
    >
      {icon}
    </button>
  );
};
