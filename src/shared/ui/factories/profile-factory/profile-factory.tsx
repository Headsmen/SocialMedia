import { Avatar, Text, Group, Stack, Badge, Indicator } from '@mantine/core';
import type { ReactNode } from 'react';

export interface ProfileAvatarConfig {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  isOnline?: boolean;
  showIndicator?: boolean;
  onClick?: () => void;
}

export interface ProfileNameConfig {
  firstName: string;
  lastName: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: number;
  truncate?: boolean;
}

export interface ProfileCardConfig {
  avatar?: string;
  firstName: string;
  lastName: string;
  subtitle?: string;
  isOnline?: boolean;
  badge?: string;
  badgeColor?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  rightSection?: ReactNode;
}

/**
 * Фабричный класс для создания компонентов профиля пользователя
 * Предоставляет готовые компоненты: аватар, имя, карточку профиля
 */
export class ProfileFactory {
  /**
   * Создает аватар пользователя с опциональным индикатором онлайн статуса
   */
  static createAvatar(config: ProfileAvatarConfig) {
    const { src, name, size = 'md', isOnline = false, showIndicator = false, onClick } = config;

    const avatar = (
      <Avatar
        src={src}
        alt={name}
        size={size}
        radius="xl"
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        onClick={onClick}
      >
        {!src && name ? name.charAt(0).toUpperCase() : null}
      </Avatar>
    );

    if (showIndicator) {
      return (
        <Indicator
          inline
          size={12}
          offset={7}
          position="bottom-end"
          color={isOnline ? 'green' : 'gray'}
          disabled={!isOnline}
        >
          {avatar}
        </Indicator>
      );
    }

    return avatar;
  }

  /**
   * Создает отображение имени пользователя
   */
  static createName(config: ProfileNameConfig) {
    const { firstName, lastName, size = 'md', weight = 500, truncate = false } = config;
    const fullName = `${firstName} ${lastName}`;

    return (
      <Text size={size} fw={weight} truncate={truncate}>
        {fullName}
      </Text>
    );
  }

  /**
   * Создает компактное отображение имени (только имя)
   */
  static createFirstName(config: Omit<ProfileNameConfig, 'lastName'>) {
    const { firstName, size = 'md', weight = 500, truncate = false } = config;

    return (
      <Text size={size} fw={weight} truncate={truncate}>
        {firstName}
      </Text>
    );
  }

  /**
   * Создает полную карточку профиля с аватаром, именем и дополнительной информацией
   */
  static createProfileCard(config: ProfileCardConfig) {
    const {
      avatar,
      firstName,
      lastName,
      subtitle,
      isOnline = false,
      badge,
      badgeColor = 'blue',
      size = 'md',
      onClick,
      rightSection,
    } = config;

    const avatarSize = size === 'sm' ? 'md' : size === 'md' ? 'lg' : 'xl';
    const nameSize = size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg';

    return (
      <Group
        wrap="nowrap"
        gap="md"
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        onClick={onClick}
      >
        {ProfileFactory.createAvatar({
          src: avatar,
          name: firstName,
          size: avatarSize,
          isOnline,
          showIndicator: true,
        })}

        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Group gap="xs" wrap="nowrap">
            {ProfileFactory.createName({
              firstName,
              lastName,
              size: nameSize,
              truncate: true,
            })}
            {badge && (
              <Badge size="sm" color={badgeColor} variant="light">
                {badge}
              </Badge>
            )}
          </Group>

          {subtitle && (
            <Text size="sm" c="dimmed" truncate>
              {subtitle}
            </Text>
          )}
        </Stack>

        {rightSection}
      </Group>
    );
  }

  /**
   * Создает мини-профиль для списков (например, список друзей)
   */
  static createMiniProfile(config: Omit<ProfileCardConfig, 'subtitle' | 'badge'>) {
    const { avatar, firstName, lastName, isOnline = false, size = 'sm', onClick } = config;

    return (
      <Group
        wrap="nowrap"
        gap="sm"
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        onClick={onClick}
      >
        {ProfileFactory.createAvatar({
          src: avatar,
          name: firstName,
          size: size === 'sm' ? 'sm' : 'md',
          isOnline,
          showIndicator: true,
        })}

        {ProfileFactory.createName({
          firstName,
          lastName,
          size: 'sm',
          truncate: true,
        })}
      </Group>
    );
  }

  /**
   * Создает профиль для хедера (большой аватар + имя вертикально)
   */
  static createHeaderProfile(config: Omit<ProfileCardConfig, 'rightSection'>) {
    const { avatar, firstName, lastName, subtitle, isOnline = false, badge, badgeColor = 'blue' } = config;

    return (
      <Stack align="center" gap="md">
        {ProfileFactory.createAvatar({
          src: avatar,
          name: firstName,
          size: 'xl',
          isOnline,
          showIndicator: true,
        })}

        <Stack align="center" gap={4}>
          <Group gap="xs">
            {ProfileFactory.createName({
              firstName,
              lastName,
              size: 'xl',
              weight: 600,
            })}
            {badge && (
              <Badge size="md" color={badgeColor} variant="light">
                {badge}
              </Badge>
            )}
          </Group>

          {subtitle && (
            <Text size="md" c="dimmed" ta="center">
              {subtitle}
            </Text>
          )}
        </Stack>
      </Stack>
    );
  }
}
