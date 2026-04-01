const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
    },
    text: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    image: {
      type: String,
    },
    likes: {
      type: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          username: String,
        },
      ],
      default: [],
    },
    comments: {
      type: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          username: String,
          text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Indexes for production performance
postSchema.index({ createdAt: -1 });
postSchema.index({ 'author.userId': 1 });

module.exports = mongoose.model("Post", postSchema);
