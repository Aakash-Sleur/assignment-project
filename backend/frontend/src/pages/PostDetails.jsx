import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ArrowLeftIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
  useGetPostByIdQuery,
  useLikePostMutation,
  useCommentPostMutation,
} from "../redux/api/postsApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function PostDetailsPage() {
  const { id } = useParams();
  const { data: post, isLoading, isError, refetch } = useGetPostByIdQuery(id);
  const [likePost] = useLikePostMutation();
  const [commentPost, { isLoading: isCommentUploading }] =
    useCommentPostMutation();
  const [newComment, setNewComment] = useState("");
  const { userInfo } = useSelector((state) => state.auth);

  const handleLikePost = async () => {
    if (!userInfo) {
      toast.error("You need to be logged in to like a post.");
      return;
    }

    try {
      await likePost(id).unwrap();
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while liking the post.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error("You need to be logged in to comment.");
      return;
    }
    if (!newComment.trim()) return;

    try {
      await commentPost({ id, comment: newComment }).unwrap();
      setNewComment("");
      toast.success("Comment added successfully!");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the comment.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">Error</h1>
        <p className="mb-6 text-gray-600">
          There was an error loading the post. Please try again later.
        </p>
        <Link
          to="/posts"
          className="px-6 py-3 text-white transition duration-300 bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl px-4 py-8 mx-auto">
      <Link
        to="/posts"
        className="inline-flex items-center mb-6 text-blue-500 transition duration-300 hover:text-blue-600"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to Posts
      </Link>
      <div className="p-6 mb-8 bg-white rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 mr-4 text-xl font-bold text-white bg-blue-500 rounded-full">
            {post.user.username[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 hover:underline">
              {post.user.username}
            </h2>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        <p className="mb-6 text-lg text-gray-700">{post.postContent}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post image"
            className="object-contain w-full mx-auto mb-6 rounded-lg shadow-md max-h-96"
          />
        )}
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLikePost}
            className="flex items-center text-gray-600 transition duration-300 hover:text-red-500"
            disabled={!userInfo}
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
          <div className="flex items-center text-gray-600">
            <ChatBubbleOvalLeftIcon className="w-6 h-6 mr-2" />
            {post.comments.length}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-6 text-2xl font-semibold text-gray-800">Comments</h3>
        {userInfo ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              disabled={isCommentUploading}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 mb-4 text-gray-700 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Write your comment here..."
            ></textarea>
            <button
              type="submit"
              disabled={isCommentUploading}
              className="flex items-center px-6 py-3 text-white transition duration-300 bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isCommentUploading ? (
                <span className="animate-pulse">Posting...</span>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                  Post Comment
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="p-4 mb-8 bg-yellow-100 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              You need to be logged in to comment.{" "}
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

        {post.comments.map((comment) => (
          <div
            key={comment._id}
            className="py-4 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex items-start">
              <div className="flex items-center justify-center w-10 h-10 mr-4 text-sm font-bold text-white bg-gray-500 rounded-full">
                {comment.user.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {comment.user.username}
                </p>
                <p className="mt-1 text-gray-700">{comment.commentText}</p>
                <p className="mt-2 text-sm text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
