export interface ProfileWidgetsProps {
  userEmail?: string;
}

export interface AvatarUploadProps {
  avatar: string;
  name: string;
  size?: number;
  onUpload: (file: File) => void;
  editable?: boolean;
}
