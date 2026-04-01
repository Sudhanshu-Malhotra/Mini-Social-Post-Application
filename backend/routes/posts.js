const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../middleware/auth");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const { validatePost } = require("../middleware/validate");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage Config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "task_social_posts",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images Only! Please upload a valid image file (jpeg, jpg, png, or gif)."));
  }
}

// @route   GET api/posts
router.get("/", auth, postController.getPosts);

// @route   POST api/posts
router.post("/", [auth, upload.single("image"), validatePost], postController.createPost);

// @route   POST api/posts/:id/like
router.post("/:id/like", auth, postController.likePost);

// @route   POST api/posts/:id/comment
router.post("/:id/comment", auth, postController.commentOnPost);

// @route   DELETE api/posts/:id
router.delete("/:id", auth, postController.deletePost);

module.exports = router;
