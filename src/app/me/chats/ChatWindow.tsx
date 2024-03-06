import React from "react";

interface Message {
  text: string;
  sender: string;
}

interface Props {
  messages: Message[];
}

export default function ChatWindow({ messages }: Props) {
  return (
    <div className="flex-grow bg-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-2">Сообщения</h2>
      <div className="overflow-y-auto h-full">
        {messages.map((message, index) => (
          <div key={index} className="bg-white rounded p-2 mb-1">
            <p>{message.text}</p>
            <p className="text-sm text-gray-500">{message.sender}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
