import jwt, { decode } from "jsonwebtoken";
import User from "../models/User.js";
import { ROLES } from "../utils/constants.js";

export const protect = async (req, res, next) => {
  let token;

  // Check for token in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to request (without password)
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const adminOrEmployee = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "employee")) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as admin or employee");
  }
};
export const admin = (req, res, next) => {
  if (req.user && req.user.role === ROLES.ADMIN) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};

export const employee = (req, res, next) => {
  if (req.user && req.user.role === ROLES.EMPLOYEE) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an employee");
  }
};

export const jobSeeker = (req, res, next) => {
  if (req.user && req.user.role === ROLES.JOB_SEEKER) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as a job seeker");
  }
};
