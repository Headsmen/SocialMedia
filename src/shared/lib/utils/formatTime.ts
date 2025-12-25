import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * Форматирует дату в относительное время ("5 минут назад")
 */
export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: ru,
  });
};

/**
 * Форматирует дату в локализованный формат
 */
export const formatDate = (date: string | Date, format?: string): string => {
  const dateObj = new Date(date);

  if (format === 'short') {
    return dateObj.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  if (format === 'time') {
    return dateObj.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return dateObj.toLocaleString('ru-RU');
};
