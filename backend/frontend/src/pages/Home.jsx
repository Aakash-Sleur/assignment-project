import { Link } from "react-router-dom";
import {
  HomeIcon,
  ChatBubbleOvalLeftIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to SocialConnect</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/posts"
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <HomeIcon className="w-12 h-12 text-blue-500 mb-4" />
          <span className="text-xl font-semibold">View Posts</span>
        </Link>
        <Link
          to="/chat"
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <ChatBubbleOvalLeftIcon className="w-12 h-12 text-green-500 mb-4" />
          <span className="text-xl font-semibold">Open Chat</span>
        </Link>
        <Link
          to="/profile"
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <UserIcon className="w-12 h-12 text-purple-500 mb-4" />
          <span className="text-xl font-semibold">My Profile</span>
        </Link>
      </div>
    </div>
  );
}
