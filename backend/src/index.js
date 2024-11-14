import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(
  cors({
    origin: "https://assignment-project-xc6w.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

// Deployment configuration
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join("./frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "./frontend/dist", "index.html"))
  );
}

// Socket.io setup
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://assignment-project-xc6w.onrender.com", // Replace with your frontend URL in production
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on("leave chat", (chatId) => {
    socket.leave(chatId);
    console.log(`User left chat: ${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export { io };
