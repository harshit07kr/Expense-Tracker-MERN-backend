const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

async function requireAuth(req, res, next) {
  try {
    // Read token from the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401); // Unauthorized if no header

    // Extract token and remove 'Bearer ' prefix
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7, authHeader.length) : authHeader;
    
    // Decode the token
    const decoded = jwt.verify(token, process.env.SECRET);

    // Check expiration
    if (Date.now() > decoded.exp * 1000) return res.sendStatus(401); // Convert exp to milliseconds

    // Find user using decoded sub
    const user = await User.findById(decoded.sub);
    if (!user) return res.sendStatus(401);

    // Attach user to req
    req.user = user;

    // Continue to next middleware
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
}

module.exports = requireAuth;
