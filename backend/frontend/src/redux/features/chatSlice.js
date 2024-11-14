import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  activeChat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    addChat: (state, action) => {
      state.chats.push(action.payload);
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      const chat = state.chats.find((c) => c._id === action.payload.chatId);
      if (chat) {
        chat.messages.push(action.payload.message);
      }
    },
    updateChat: (state, action) => {
      const index = state.chats.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.chats[index] = action.payload;
      }
    },
  },
});

export const { setChats, addChat, setActiveChat, addMessage, updateChat } =
  chatSlice.actions;
export default chatSlice.reducer;
