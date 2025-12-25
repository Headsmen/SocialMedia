import { useState, useRef } from 'react';

interface UseAvatarUploadProps {
  onUpload: (file: File) => void;
  editable?: boolean;
}

export const useAvatarUpload = ({ onUpload, editable = false }: UseAvatarUploadProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (editable) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleMouseEnter = () => {
    if (editable) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setIsHovered(false);
    }
  };

  return {
    isHovered,
    fileInputRef,
    handleClick,
    handleFileChange,
    handleMouseEnter,
    handleMouseLeave,
  };
};
