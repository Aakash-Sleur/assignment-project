import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import PostsPage from "./pages/PostsPage";
import ChatsPage from "./pages/Chatspage";
import ChatPage from "./pages/ChatPage";
import AuthLayout from "./components/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PostDetailsPage from "./pages/PostDetails";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <main>
      <ToastContainer />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/posts" />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/post/:id" element={<PostDetailsPage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </main>
  );
};

export default App;
