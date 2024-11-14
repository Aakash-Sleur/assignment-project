import { Link } from "react-router-dom";
import {
  ChatBubbleLeftRightIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useGetChatsQuery } from "../redux/api/chatsApiSlice";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";

export default function ChatsPage() {
  const { data: chats, isLoading, isError } = useGetChatsQuery();
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <LockClosedIcon className="w-20 h-20 mb-6 text-blue-500" />
        <h2 className="mb-4 text-3xl font-bold text-gray-800">
          Login Required
        </h2>
        <p className="mb-6 text-lg text-gray-600">
          Please log in to view your chats.
        </p>
        <Link
          to="/login"
          className="px-6 py-3 text-lg font-medium text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <ExclamationCircleIcon className="w-20 h-20 mb-6 text-red-500" />
        <h3 className="mb-4 text-2xl font-bold text-gray-800">
          Error loading chats
        </h3>
        <p className="mb-6 text-lg text-gray-600">
          Please try again later or contact support if the problem persists.
        </p>
        <Link
          to="/"
          className="px-6 py-3 text-lg font-medium text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  const getOtherUser = (chat) => {
    return chat.users.find((user) => user._id !== userInfo._id) || {};
  };

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Your Chats</h1>
      <div className="overflow-hidden bg-white rounded-lg shadow-lg">
        {chats && chats.length > 0 ? (
          chats.map((chat) => {
            const otherUser = getOtherUser(chat);
            const lastMessage = chat.messages[chat.messages.length - 1];
            return (
              <Link
                key={chat._id}
                to={`/chat/${chat._id}`}
                className="block transition duration-200 hover:bg-gray-50"
              >
                <div className="flex items-center px-6 py-4 border-b border-gray-200">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center text-xl font-bold text-white bg-blue-500 rounded-full w-14 h-14">
                      {otherUser.username
                        ? otherUser.username[0].toUpperCase()
                        : "?"}
                    </div>
                  </div>
                  <div className="flex-grow ml-4">
                    <div className="flex items-baseline justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {otherUser.username || "Unknown User"}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {lastMessage
                          ? formatDistanceToNow(
                              new Date(lastMessage.timestamp),
                              {
                                addSuffix: true,
                              }
                            )
                          : "No messages"}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-600 truncate">
                      {lastMessage ? lastMessage.text : "No messages yet"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="py-12 text-center">
            <ChatBubbleLeftRightIcon className="w-20 h-20 mx-auto text-gray-400" />
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              No chats yet
            </h3>
            <p className="mt-2 text-lg text-gray-500">
              Get started by messaging a friend.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
