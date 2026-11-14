
import jwt from "jsonwebtoken";

//	Memastikan pengguna sudah login
const authenticateToken = (req, res, next) => {
    // Client mengirim token melalui header
    const authHeader = req.headers.authorization;

    console.log("Authorization:", authHeader);

    // Mengambil token setelah kata Bearer
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token tidak ditemukan"
        });
    }

    try {
        // Memeriksa tanda tangan dan masa berlaku JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Menyimpan payload JWT ke req.user
        req.user = decoded;

        // Melanjutkan request
        next();

    } catch (error) {
        return res.status(403).json({
            message: "Token tidak valid atau kedaluwarsa"
        });
    }
};

//Memeriksa apakah role pengguna sesuai izin


export { authenticateToken };
