import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" }),
  tagTypes: ["Posts", "Users", "Chats"],
  endpoints: () => ({}),
});
