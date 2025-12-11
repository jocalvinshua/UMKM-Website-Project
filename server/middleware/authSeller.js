import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  try {
    // ✅ Get cookie properly
    const { sellerToken } = req.cookies;

    if (!sellerToken) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized: No token provided" });
    }

    // ✅ Verify token
    const tokenDecode = jwt.verify(sellerToken, process.env.SECRET_KEY);

    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      req.user = tokenDecode; // ✅ Optional: make user data accessible later
      return next();
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Not Authorized: Invalid token" });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default authSeller;
