import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Intialise express app
const app = express();

// CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files
app.use(express.static("public"));

// Cookie parser middleware
app.use(cookieParser());

// Routes import
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes/comment.routes.js";
import userRouter from "./routes/register.routes.js";

// Routes
app.use(express.json());
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/user", userRouter);

export { app };
