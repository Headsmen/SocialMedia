const DEFAULT_PLACEHOLDER = 'https://via.placeholder.com/50';
const DEFAULT_AVATAR_PLACEHOLDER = 'https://via.placeholder.com/50?text=User';

/**
 * Обработчик ошибки загрузки изображения
 * Заменяет сломанное изображение на placeholder
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>,
  placeholder: string = DEFAULT_PLACEHOLDER
): void => {
  const target = event.target as HTMLImageElement;
  if (target.src !== placeholder) {
    target.src = placeholder;
  }
};

/**
 * Специфичный обработчик для аватаров
 */
export const handleAvatarError = (event: React.SyntheticEvent<HTMLImageElement>): void => {
  handleImageError(event, DEFAULT_AVATAR_PLACEHOLDER);
};
