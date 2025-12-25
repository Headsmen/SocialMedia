export interface MessageInputProps {
  chatId: string;
  onSend: (content: string) => void;
  disabled?: boolean;
}
