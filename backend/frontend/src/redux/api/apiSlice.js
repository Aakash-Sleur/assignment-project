import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://assignment-project-xc6w.onrender.com";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" }),
  tagTypes: ["Posts", "Users", "Chats"],
  endpoints: () => ({}),
});
