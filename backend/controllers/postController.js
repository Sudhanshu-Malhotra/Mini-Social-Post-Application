const Post = require("../models/Post");
const fs = require("fs");
const path = require("path");

exports.createPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    
    // image file from multer
    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    console.log("CreatePost Triggered:", { text, hasImage: !!req.file, userId: req.user.id });

    if (!text && !imageUrl) {
      return res.status(400).json({ msg: "Post must contain either text or image" });
    }

    const newPost = new Post({
      author: {
        userId: req.user.id,
        username: req.user.username,
      },
      text,
      image: imageUrl,
      likes: [],
      comments: [],
    });

    const post = await newPost.save();
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    // Basic pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const total = await Post.countDocuments();

    res.json({
      success: true,
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, msg: "Post not found" });
    }

    // Check if post already liked by user
    const likedIndex = post.likes.findIndex((like) => like.userId.toString() === req.user.id);

    if (likedIndex !== -1) {
      // Unlike
      post.likes.splice(likedIndex, 1);
    } else {
      // Like
      post.likes.unshift({ userId: req.user.id, username: req.user.username });
    }

    await post.save();
    res.json({ success: true, data: post.likes });
  } catch (err) {
    next(err);
  }
};

exports.commentOnPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    const cleanText = text?.trim();
    if (!cleanText) {
      return res.status(400).json({ success: false, msg: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, msg: "Post not found" });
    }

    const newComment = {
      userId: req.user.id,
      username: req.user.username,
      text: cleanText,
    };

    post.comments.unshift(newComment);
    await post.save();

    res.json({ success: true, data: post.comments });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, msg: "Post not found" });
    }

    // Check author
    if (post.author.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, msg: "Unauthorized: You can only delete your own posts" });
    }

    // Delete image if exists locally
    if (post.image && post.image.startsWith("/uploads/")) {
      const imagePath = path.join(__dirname, "..", post.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting image file:", err);
      });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: "Post removed" });
  } catch (err) {
    next(err);
  }
};
