import React from 'react';
import styles from './UserInfo.module.scss';

export interface UserInfoProps {
  name: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const UserInfo: React.FC<UserInfoProps> = ({
  name,
  subtitle,
  size = 'md',
  onClick,
  className = '',
}) => {
  const sizeClass = styles[`userInfo--${size}`];
  const clickableClass = onClick ? styles['userInfo--clickable'] : '';

  return (
    <div
      className={`${styles.userInfo} ${sizeClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      <h3 className={styles.name}>{name}</h3>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
};
