import { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetChatByIdQuery,
  useSendMessageMutation,
} from "../redux/api/chatsApiSlice";
import { io } from "socket.io-client";

export default function ChatPage() {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const { data: chat, isLoading, isError } = useGetChatByIdQuery(id);
  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    socketRef.current = io("http://localhost:3000"); // Replace with your server URL

    socketRef.current.emit("join chat", id);

    socketRef.current.on("new message", (data) => {
      if (data.chatId === id) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    });

    return () => {
      socketRef.current.emit("leave chat", id);
      socketRef.current.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (chat) {
      setMessages(chat.messages);
    }
  }, [chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        await sendMessage({ id, message: newMessage }).unwrap();
        setNewMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        Error loading chat
      </div>
    );
  }

  const otherUser = chat.users.find((user) => user._id !== userInfo._id);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md h-[calc(100vh-2rem)]">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold">Chat with {otherUser.username}</h2>
      </div>
      <div className="flex flex-col h-[calc(100%-8rem)]">
        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === userInfo._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex items-end space-x-2 ${
                  message.sender === userInfo._id
                    ? "flex-row-reverse space-x-reverse"
                    : "flex-row"
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 font-bold text-gray-600 bg-gray-300 rounded-full">
                  {message.sender === userInfo._id
                    ? userInfo.username[0]
                    : otherUser.username[0]}
                </div>
                <div
                  className={`rounded-lg p-2 max-w-xs ${
                    message.sender === userInfo._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="flex p-4 border-t">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 text-white transition duration-300 bg-blue-500 rounded-r-md hover:bg-blue-600"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
