import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  PhotoIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
  useGetPostsQuery,
  useCreatePostMutation,
  useLikePostMutation,
} from "../redux/api/postsApiSlice";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";

export default function PostsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { data: posts, refetch } = useGetPostsQuery();
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [likePost] = useLikePostMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("userInfo");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && !image) return;

    try {
      let imageUrl = "";
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "woqueaks");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/diviaanea/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Image upload failed" + JSON.stringify(response));
        }

        const data = await response.json();
        imageUrl = data.secure_url;
      }

      await createPost({ postContent: newPost, imageUrl }).unwrap();
      toast.success("Post created successfully!");
      setNewPost("");
      setImage(null);
      setImagePreview(null);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during post creation.");
    }
  };

  const handleLikePost = async (postId) => {
    if (!isLoggedIn) {
      toast.error("You need to be logged in to like a post.");
      return;
    }

    try {
      await likePost(postId).unwrap();
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while liking the post.");
    }
  };

  if (!posts)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-5xl px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Posts</h1>
      {isLoggedIn ? (
        <form
          onSubmit={handlePostSubmit}
          className="mb-8 bg-white rounded-lg shadow-md"
        >
          <div className="p-4">
            <textarea
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full p-2 text-gray-700 bg-gray-100 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="flex items-center mt-2">
              <label htmlFor="image-upload" className="cursor-pointer">
                <PhotoIcon className="w-6 h-6 text-gray-500 transition-colors duration-200 hover:text-blue-500" />
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover w-16 h-16 ml-2 rounded-md"
                />
              )}
              <button
                type="submit"
                disabled={isCreating}
                className="flex items-center px-4 py-2 ml-auto text-white transition duration-200 bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              >
                <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                {isCreating ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 mb-8 bg-yellow-100 border border-yellow-200 rounded-lg shadow-md">
          <p className="text-yellow-800">
            You need to be logged in to create a post.{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Log in
            </Link>{" "}
            or{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              create an account
            </Link>{" "}
            to join the conversation!
          </p>
        </div>
      )}
      {posts.map((post) => (
        <div
          key={post._id}
          className="p-6 mb-6 transition-shadow duration-200 bg-white rounded-lg shadow-md hover:shadow-lg"
        >
          <div className="flex items-center mb-4 space-x-4">
            <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white bg-blue-500 rounded-full">
              {post.user.username[0].toUpperCase()}
            </div>
            <div>
              <Link
                to={`/profile/${post.user._id}`}
                className="text-lg font-semibold text-gray-800 hover:underline"
              >
                {post.user.username}
              </Link>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <p className="mb-4 text-gray-700">{post.postContent}</p>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post image"
              className="object-cover w-full mx-auto mb-4 rounded-lg shadow-md max-h-96"
            />
          )}
          <div className="flex gap-x-8">
            <button
              onClick={() => handleLikePost(post._id)}
              className="flex items-center text-gray-600 transition-colors duration-200 hover:text-red-500"
              disabled={!isLoggedIn}
            >
              <HeartIcon
                className={`w-6 h-6 mr-2 ${
                  post.likes.includes(userInfo?._id) ? "text-red-500" : ""
                }`}
                fill={
                  post.likes.includes(userInfo?._id) ? "currentColor" : "none"
                }
              />
              {post.likes.length}
            </button>
            <button
              onClick={() => navigate(`/post/${post._id}`)}
              className="flex items-center text-gray-600 transition-colors duration-200 hover:text-green-500"
            >
              <ChatBubbleOvalLeftIcon className="w-6 h-6 mr-2" />
              {post.comments.length}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
