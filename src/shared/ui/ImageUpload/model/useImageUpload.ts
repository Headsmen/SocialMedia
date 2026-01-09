import { useState } from 'react';
import type { FileWithPath } from '@mantine/dropzone';

export interface UseImageUploadProps {
  onChange: (value: string | null) => void;
}

export function useImageUpload({ onChange }: UseImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const handleDrop = async (files: FileWithPath[]) => {
    if (files.length === 0) return;

    const file = files[0];
    setLoading(true);

    try {
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

  return {
    loading,
    handleDrop,
    handleRemove,
  };
}
