import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useUpdateUserProfileMutation,
  useGetUserProfileQuery,
} from "../redux/api/usersApiSlice";

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: profile, isLoading: isProfileLoading } = useGetUserProfileQuery(
    userInfo?._id
  );
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setEmail(profile.email || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { username, email, bio };
      await updateProfile(updatedData).unwrap();
      navigate(`/profile/${userInfo._id}`);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  if (isProfileLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded-lg shadow-xl">
      <h2 className="mb-6 text-2xl font-bold text-center">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            New Password (leave blank to keep current)
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="bio"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full h-24 px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          >
            {isUpdating ? "Updating..." : "Update Profile"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/profile/${userInfo._id}`)}
            className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
