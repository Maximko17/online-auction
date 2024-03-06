import React from "react";

export interface Chat {
  id: number;
  name: string;
}

interface Props {
  chats: Chat[];
  selectChat: (chatId: number) => void;
}

const ChatList: React.FC<Props> = ({ chats, selectChat }) => {
  return (
    <div className="bg-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-2">Чаты</h2>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => selectChat(chat.id)}
            className="cursor-pointer hover:bg-gray-300 rounded p-2 mb-1"
          >
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
