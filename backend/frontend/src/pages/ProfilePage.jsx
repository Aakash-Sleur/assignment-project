import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import {
  useGetUserProfileQuery,
  useToggleFollowUserMutation,
} from "../redux/api/usersApiSlice";
import { useGetUserPostsQuery } from "../redux/api/postsApiSlice";
import { useCreateChatMutation } from "../redux/api/chatsApiSlice";
import { toast } from "react-toastify";
import TabButton from "../components/TabButton";

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: profile,
    isLoading: profileLoading,
    refetch,
  } = useGetUserProfileQuery(id);
  const { data: posts, isLoading: postsLoading } = useGetUserPostsQuery(id);
  const [toggleFollow, { isLoading: followLoading }] =
    useToggleFollowUserMutation();
  const [createChat, { isLoading: chatLoading }] = useCreateChatMutation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (profile && userInfo) {
      setIsFollowing(
        profile.followers.some((follower) => follower._id === userInfo._id)
      );
    }
  }, [profile, userInfo]);

  const handleFollowToggle = async () => {
    if (!userInfo) {
      toast.error("You need to be logged in to follow users.");
      return;
    }

    try {
      await toggleFollow(profile._id).unwrap();
      setIsFollowing((prevState) => !prevState);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating follow status.");
    }
  };

  const handleChatStart = async () => {
    if (!userInfo) {
      toast.error("You need to be logged in to start a chat.");
      return;
    }

    try {
      const result = await createChat(id).unwrap();
      navigate(`/chat/${result._id}`);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the chat.");
    }
  };

  if (profileLoading || postsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          User not found
        </h1>
        <Link to="/posts" className="text-blue-500 hover:underline">
          Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto">
      <div className="overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6 text-white">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-24 h-24 mr-4 text-3xl font-bold text-blue-500 bg-white rounded-full shadow-md">
                {profile.username[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profile.username}</h1>
                <p className="text-sm opacity-90">{profile.bio}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {userInfo && userInfo._id === profile._id ? (
                <Link
                  to="/edit-profile"
                  className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 bg-white rounded-full shadow-md hover:bg-blue-50"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              ) : (
                <>
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 shadow-md ${
                      isFollowing
                        ? "bg-white text-blue-600 hover:bg-blue-50"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {followLoading ? (
                      <span className="animate-pulse">...</span>
                    ) : isFollowing ? (
                      "Unfollow"
                    ) : (
                      "Follow"
                    )}
                  </button>
                  <button
                    onClick={handleChatStart}
                    disabled={chatLoading}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-green-500 rounded-full shadow-md hover:bg-green-600"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                    {chatLoading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      "Chat"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-around p-4 text-center bg-gray-50">
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {posts?.length || 0}
            </p>
            <p className="text-sm text-gray-600">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {profile.followers.length}
            </p>
            <p className="text-sm text-gray-600">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {profile.following.length}
            </p>
            <p className="text-sm text-gray-600">Following</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md">
        <div className="flex border-b border-gray-200">
          <TabButton
            label="Posts"
            value="posts"
            activeTab={activeTab}
            setActiveTab={() => setActiveTab("posts")}
          />
          <TabButton
            label="Followers"
            value="followers"
            activeTab={activeTab}
            setActiveTab={() => setActiveTab("followers")}
          />
          <TabButton
            label="Following"
            value="following"
            activeTab={activeTab}
            setActiveTab={() => setActiveTab("following")}
          />
        </div>

        <div className="p-6">
          {activeTab === "posts" && (
            <div>
              <h2 className="mb-4 text-xl font-bold sr-only">Posts</h2>
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post._id}
                    className="py-4 transition-colors duration-200 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                  >
                    <Link to={`/post/${post._id}`} className="block">
                      <p className="mb-2 text-lg text-gray-800">
                        {post.postContent}
                      </p>
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt="Post image"
                          className="object-contain w-full mx-auto mb-4 rounded-md max-h-96"
                        />
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <HeartIcon className="w-4 h-4 mr-1 text-red-500" />
                        <span className="mr-4">{post.likes.length} likes</span>
                        <ChatBubbleOvalLeftIcon className="w-4 h-4 mr-1 text-blue-500" />
                        <span className="mr-4">
                          {post.comments.length} comments
                        </span>
                        <span>
                          {formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No posts yet.</p>
              )}
            </div>
          )}

          {activeTab === "followers" && (
            <div>
              <h2 className="mb-4 text-xl font-bold sr-only">Followers</h2>
              {profile.followers?.length > 0 ? (
                <ul className="space-y-4">
                  {profile?.followers.map((follower) => (
                    <li
                      key={follower._id}
                      className="flex items-center transition-colors duration-200 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-center w-12 h-12 mr-4 text-lg font-bold text-white bg-blue-500 rounded-full">
                        {follower.username[0].toUpperCase()}
                      </div>
                      <Link
                        to={`/profile/${follower._id}`}
                        className="text-lg font-medium text-gray-800 hover:underline"
                      >
                        {follower.username}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No followers yet.</p>
              )}
            </div>
          )}

          {activeTab === "following" && (
            <div>
              <h2 className="mb-4 text-xl font-bold sr-only">Following</h2>
              {profile.following?.length > 0 ? (
                <ul className="space-y-4">
                  {profile.following.map((following) => (
                    <li
                      key={following._id}
                      className="flex items-center transition-colors duration-200 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-center w-12 h-12 mr-4 text-lg font-bold text-white bg-green-500 rounded-full">
                        {following.username[0].toUpperCase()}
                      </div>
                      <Link
                        to={`/profile/${following._id}`}
                        className="text-lg font-medium text-gray-800 hover:underline"
                      >
                        {following.username}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Not following anyone yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
