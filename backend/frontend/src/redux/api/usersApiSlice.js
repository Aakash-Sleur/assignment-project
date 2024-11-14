import { apiSlice } from "./apiSlice";
import { USER_URL, AUTH_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
    }),
    getUserProfile: builder.query({
      query: (id) => `${USER_URL}/${id}`,
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    toggleFollowUser: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/${id}/follow`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useToggleFollowUserMutation,
} = userApiSlice;
