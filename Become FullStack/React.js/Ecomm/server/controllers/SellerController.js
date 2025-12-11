import jwt from 'jsonwebtoken';

// Seller Login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and Password are required',
      });
    }

    // ✅ FIX: Should use OR (||), not AND (&&)
    if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {
      const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1d' });

      // ✅ FIX: Typo corrections and cookie settings
      res.cookie('sellerToken', token, {
        httpOnly: true, // Prevent JavaScript access
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      });

      return res.json({
        success: true,
        message: 'Login successfully',
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Incorrect Email or Password',
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Seller Authentication
export const isSellerAuth = async (req, res) => {
  try {
    // You must verify the token first before returning user info
    const token = req.cookies.sellerToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = jwt.verify(token, process.env.SECRET_KEY);
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Seller Logout
export const userLogout = async (req, res) => {
  try {
    // ✅ FIX: remove space in cookie name and typo in "process"
    res.clearCookie('sellerToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
