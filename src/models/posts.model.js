import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },

    title: {
      type: String,
      required: true,
    },

    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Posts = mongoose.model("Posts", postSchema);

export default Posts;
