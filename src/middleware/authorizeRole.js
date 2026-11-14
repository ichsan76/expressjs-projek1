//Digunakan agar middleware bisa menerima satu atau beberapa role.
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {

        //Memeriksa role pengguna
        if(!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Akses ditolak, role tidak diizinkan"
            })
        }

        next();
    };
};

export {authorizeRole};