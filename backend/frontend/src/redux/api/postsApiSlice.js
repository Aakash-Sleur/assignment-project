import { POST_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => ({
        url: POST_URL,
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),
    getPostById: builder.query({
      query: (id) => ({
        url: `${POST_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),
    createPost: builder.mutation({
      query: (post) => ({
        url: POST_URL,
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Posts"],
    }),
    likePost: builder.mutation({
      query: (id) => ({
        url: `${POST_URL}/${id}/like`,
        method: "POST",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const { auth } = getState();
        const userId = auth.userInfo?._id;

        const patchResult = dispatch(
          postApiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
            const post = draft.find((p) => p._id === id);
            if (post) {
              const userLikedIndex = post.likes.indexOf(userId);
              if (userLikedIndex !== -1) {
                post.likes.splice(userLikedIndex, 1);
              } else {
                post.likes.push(userId);
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    commentPost: builder.mutation({
      query: ({ id, comment }) => ({
        url: `${POST_URL}/${id}/comment`,
        method: "POST",
        body: { commentText: comment },
      }),
      invalidatesTags: ["Posts"],
    }),
    getUserPosts: builder.query({
      query: (id) => `${POST_URL}/${id}/user`,
      providesTags: ["Posts"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useLikePostMutation,
  useCommentPostMutation,
  useGetUserPostsQuery,
} = postApiSlice;
