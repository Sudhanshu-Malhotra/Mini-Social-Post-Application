const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  let { username, email, password } = req.body;
  try {
    email = email.trim().toLowerCase();
    username = username.trim();
    
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ success: false, msg: "User already exists with that email or username" });
    }

    user = new User({
      username,
      email,
      password,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        username: user.username,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          success: true,
          token, 
          user: { id: user.id, username: user.username, email: user.email } 
        });
      }
    );
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  let { email, password } = req.body;

  try {
    const identifier = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Find user by email OR username
    let user = await User.findOne({ 
      $or: [
        { email: identifier }, 
        { username: email.trim() } 
      ] 
    });

    if (!user) {
      return res.status(400).json({ success: false, msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          success: true,
          token, 
          user: { id: user.id, username: user.username, email: user.email } 
        });
      }
    );
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
