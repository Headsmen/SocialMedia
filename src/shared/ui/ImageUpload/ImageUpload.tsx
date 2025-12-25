import { Group, Text, rem, Image, CloseButton, Stack } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, type FileWithPath } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { useState } from 'react';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string | null) => void;
  error?: string;
}

export function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const handleDrop = async (files: FileWithPath[]) => {
    if (files.length === 0) return;

    const file = files[0];
    setLoading(true);

    try {
      // Конвертируем файл в base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onChange(base64);
        setLoading(false);
      };
      reader.onerror = () => {
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  if (value) {
    return (
      <Stack gap="xs">
        <Text size="sm" fw={500}>
          Изображение
        </Text>
        <div style={{ position: 'relative', width: 'fit-content' }}>
          <Image
            src={value}
            alt="Preview"
            radius="md"
            mah={300}
            fit="contain"
          />
          <CloseButton
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'var(--mantine-color-dark-6)',
            }}
            size="md"
          />
        </div>
      </Stack>
    );
  }

  return (
    <div>
      <Text size="sm" fw={500} mb="xs">
        Добавить изображение
      </Text>
      <Dropzone
        onDrop={handleDrop}
        onReject={() => {}}
        maxSize={5 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        loading={loading}
      >
        <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Перетащите изображение или нажмите для выбора
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Максимальный размер файла: 5 МБ
            </Text>
          </div>
        </Group>
      </Dropzone>
      {error && (
        <Text c="red" size="sm" mt="xs">
          {error}
        </Text>
      )}
    </div>
  );
}
