export interface UserFormData {
  firstName: string;
  lastName: string;
}

export interface PostFormData {
  content: string;
  imageUrl?: string;
}

export type FormMode = 'create' | 'edit';

export interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => Promise<void>;
  mode?: FormMode;
}

export interface PostFormProps {
  initialData?: PostFormData;
  onSubmit: (data: PostFormData) => Promise<void>;
  mode?: FormMode;
}
