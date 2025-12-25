import { Notification } from "@mantine/core";
import { IconCheck, IconX, IconInfoCircle } from "@tabler/icons-react";

export interface NotificationConfig {
  title: string;
  message: string;
  onClose?: () => void;
}

export class NotificationFactory {
  static createSuccess(config: NotificationConfig) {
    return (
      <Notification
        icon={<IconCheck size="1.1rem" />}
        color="teal"
        title={config.title}
        onClose={config.onClose}
        mb="md"
      >
        {config.message}
      </Notification>
    );
  }

  static createError(config: NotificationConfig) {
    return (
      <Notification
        icon={<IconX size="1.1rem" />}
        color="red"
        title={config.title}
        onClose={config.onClose}
        mb="md"
      >
        {config.message}
      </Notification>
    );
  }

  static createInfo(config: NotificationConfig) {
    return (
      <Notification
        icon={<IconInfoCircle size="1.1rem" />}
        color="blue"
        title={config.title}
        onClose={config.onClose}
        mb="md"
      >
        {config.message}
      </Notification>
    );
  }
}
