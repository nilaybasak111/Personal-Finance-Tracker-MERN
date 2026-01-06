import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  // If Authorization header is not present in the request
  // Then It Returns Empty String ("")
  const authHeader = req.headers.authorization || "";

  // Here We Split Bearer from JWT Token
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "JWT Token Not Found / JWT Format Not Correct",
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (user) {
      req.user = user;
      next();
    }
  } catch (error) {
    return res.status(401).json({ message: "You Are Not Logged In" });
  }
};

export default authMiddleware;
