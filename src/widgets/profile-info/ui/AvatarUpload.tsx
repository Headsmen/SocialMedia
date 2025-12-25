import { Box, Overlay } from '@mantine/core';
import { IconCamera } from '@tabler/icons-react';
import { useAvatarUpload } from './useAvatarUpload';
import styles from './AvatarUpload.module.scss';

interface AvatarUploadProps {
  avatar: string;
  name: string;
  size?: number;
  onUpload: (file: File) => void;
  editable?: boolean;
}

export const AvatarUpload = ({
  avatar,
  name,
  size = 120,
  onUpload,
  editable = false
}: AvatarUploadProps) => {
  const {
    isHovered,
    fileInputRef,
    handleClick,
    handleFileChange,
    handleMouseEnter,
    handleMouseLeave,
  } = useAvatarUpload({ onUpload, editable });

  return (
    <Box
      className={styles.avatarContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        cursor: editable ? 'pointer' : 'default',
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
      }}
    >
      <img
        src={avatar}
        alt={name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {editable && isHovered && (
        <Overlay
          className={styles.overlay}
          opacity={0.7}
          color="#000"
          radius="50%"
        >
          <Box className={styles.overlayContent}>
            <IconCamera size={32} color="white" />
           
          </Box>
        </Overlay>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </Box>
  );
};
