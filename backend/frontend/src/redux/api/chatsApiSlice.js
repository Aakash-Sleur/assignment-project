import { CHAT_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => ({
        url: CHAT_URL,
        method: "GET",
      }),
      providesTags: ["Chats"],
    }),
    createChat: builder.mutation({
      query: (id) => ({
        url: `${CHAT_URL}/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Chats"],
    }),
    getChatById: builder.query({
      query: (id) => ({
        url: `${CHAT_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["Chats"],
    }),
    sendMessage: builder.mutation({
      query: ({ id, message }) => ({
        url: `${CHAT_URL}/${id}/message`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: ["Chats"],
    }),
  }),
});

export const {
  useGetChatsQuery,
  useCreateChatMutation,
  useGetChatByIdQuery,
  useSendMessageMutation,
} = chatApiSlice;
