import User from "../models/User.js"

// Ganti 're' menjadi 'res' dan ambil userId dari req.user yang disuntikkan oleh authUser
export const updateCart = async(req, res)=>{
    try {
        const userId = req.user.id || req.user._id; 
        const { itemId, quantity } = req.body; 

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User ID missing from request.' });
        }

        let userDoc = await User.findById(userId);

        if (!userDoc) {
            return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
        }
        
        if (!userDoc.cartItems) {
            userDoc.cartItems = {};
        }

        if (quantity > 0) {
            userDoc.cartItems[itemId] = quantity;
        } else {
            delete userDoc.cartItems[itemId];
        }

        await User.findByIdAndUpdate(
            userId, 
            { cartItems: userDoc.cartItems }, // Kirim objek keranjang yang sudah dimodifikasi
            { new: true, runValidators: true } 
        );
        
        res.json({ 
            success: true, 
            message: 'Keranjang berhasil diperbarui di server.',
        });

    } catch (error) {
        console.error("Error updating cart:", error.message);
        res.status(500).json({ success: false, message: 'Gagal memperbarui keranjang: ' + error.message });
    }
}
