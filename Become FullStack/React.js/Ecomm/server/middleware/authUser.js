import jwt from 'jsonwebtoken';
// import User dari lokasi model Anda
import User from '../models/User.js'; // Ganti path sesuai struktur Anda

const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not Authenticated: Token missing' 
            });
        }
        
        // Ganti JWT_SECRET dengan SECRET_KEY jika itu yang Anda gunakan
        const decoded = jwt.verify(token, process.env.SECRET_KEY); 
        
        // 1. Cari pengguna di database
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            // Pengguna dihapus tetapi tokennya valid (token ghost)
            return res.status(401).json({ 
                success: false, 
                message: 'Not Authenticated: User not found' 
            });
        }

        // 2. Lampirkan data pengguna ke objek permintaan
        req.user = user; 
        
        // 3. Lanjutkan ke middleware atau controller berikutnya
        next();
        
    } catch (error) {
        // Blok ini menangani error dari jwt.verify (Expired, Invalid signature)
        console.error("Auth Error:", error.message);
        return res.status(401).json({ 
            success: false, 
            message: 'Not Authenticated: Invalid or expired token' 
        });
    }
};

export default authUser;