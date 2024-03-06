"use client";

import React, { useState } from "react";
import ChatList, { Chat } from "./ChatList";
import ChatWindow from "./ChatWindow";

export default function () {
  const [chats, setChats] = useState<Chat[]>([
    { id: 1, name: "Чат 1" },
    { id: 2, name: "Чат 2" },
    { id: 3, name: "Чат 3" },
  ]);

  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  const selectChat = (chatId: number) => {
    setSelectedChatId(chatId);
  };

  const messages = [
    { text: "Привет, как дела?", sender: "User" },
    { text: "Привет! Все отлично, спасибо!", sender: "Friend" },
  ];

  return (
    <div className="flex h-screen">
      <ChatList chats={chats} selectChat={selectChat} />
      <ChatWindow messages={messages} />
    </div>
  );
}
