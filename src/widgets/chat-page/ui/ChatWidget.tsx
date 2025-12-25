import { ChatsList } from "@/widgets/chats-list";
import { Title } from "@mantine/core";

export function ChatWidget() {
  return (
    <>
      <Title order={2} mb="lg">
        Сообщения
      </Title>
      <ChatsList />
    </>
  );
}
