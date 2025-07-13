import jwt from 'jsonwebtoken';
import User from "../models/user.model.js"; 

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies["jwt-freelance"];

    if (!token) {
      return res.status(401).json({ error: "Not authenticated. Token missing." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required roles: ${roles.join(', ')}.`,
      });
    }

    next();
  };
};