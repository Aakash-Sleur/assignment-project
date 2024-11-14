import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ChatBubbleOvalLeftIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useLogoutMutation } from "../redux/api/usersApiSlice";
import { logout } from "../redux/features/auth/auth-slice";

export default function Sidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    // TODO: Replace this with actual authentication check
    const checkLoginStatus = () => {
      const token = localStorage.getItem("userInfo");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      localStorage.removeItem("userInfo");
      dispatch(logout());
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-64 h-screen text-white bg-gray-800">
      <div className="p-4">
        <h1 className="text-2xl font-bold">SocialConnect</h1>
      </div>
      <nav className="flex-1">
        <Link
          to="/posts"
          className={`flex items-center px-4 py-2 mt-2 text-gray-100 ${
            pathname === "/posts" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Posts
        </Link>
        <Link
          to="/chats"
          className={`flex items-center px-4 py-2 mt-2 text-gray-100 ${
            pathname === "/chats" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
        >
          <ChatBubbleOvalLeftIcon className="w-5 h-5 mr-2" />
          Chats
        </Link>
        {isLoggedIn && (
          <Link
            to={`/profile/${userInfo?._id}`}
            className={`flex items-center px-4 py-2 mt-2 text-gray-100 ${
              pathname === "/profile" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            <UserIcon className="w-5 h-5 mr-2" />
            Profile
          </Link>
        )}
      </nav>
      <div className="p-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-gray-100 bg-red-600 rounded hover:bg-red-700"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="flex items-center px-4 py-2 text-gray-100 bg-green-600 rounded hover:bg-green-700"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
