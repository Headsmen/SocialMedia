import React from 'react';
import styles from './Avatar.module.scss';

export interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  className?: string;
  fallbackName?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  onClick,
  className = '',
  fallbackName,
}) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (fallbackName) {
      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=random`;
    } else {
      target.src = 'https://via.placeholder.com/150';
    }
  };

  const sizeClass = styles[`avatar--${size}`];
  const clickableClass = onClick ? styles['avatar--clickable'] : '';

  return (
    <img
      src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || alt)}&background=random`}
      alt={alt}
      className={`${styles.avatar} ${sizeClass} ${clickableClass} ${className}`}
      onClick={onClick}
      onError={handleError}
    />
  );
};
