import dbPool from "../config/database.js";

const registerUser = (body) => {
    const SQLQuery = `INSERT INTO users (name, email, password)
                      VALUE (?,?,?)`;

    return dbPool.execute(SQLQuery,[
    body.name,
    body.email,
    body.password
]);

};

const loginUser = (email) => {
    const SQLQuery = `SELECT * FROM users WHERE email = ?`;

     return dbPool.execute(SQLQuery, [email]);
}

//sudah tidak dipakai
const getUserById = (id) => {
    const SQLQuery = `SELECT id, name, email FROM users WHERE id = ?`;

    return dbPool.execute(SQLQuery,[id]);
}

//Membuat Model untuk mengambil semua pengguna
const getAllUsers = () => {
    const SQLQuey = ` SELECT id, name, email, role, created_at
                        FROM users`
    return dbPool.execute(SQLQuey);
}

const deleteUser = (id) => {
    const SQLQuery = ` DELETE FROM users WHERE id = ?`;

    return dbPool.execute(SQLQuery, [id]);
}

const updateUser = (data, id) => {
    const SQLQuery = `UPDATE users SET name = ?, email = ?
                        WHERE id = ?`
    
    return dbPool.execute(SQLQuery, [
        data.name, //nama baru.
        data.email, //email baru
        id //menentukan pengguna yang akan diubah.
    ])
}

const searchUsers = (search) => {
    const SQLQuery = `SELECT id, name, email, role, created_at
                        FROM users 
                        WHERE name LIKE ? OR email LIKE ?`
    //LIKE digunakan untuk pencarian berdasarkan teks.
    //%${search}% memungkinkan pencarian sebagian kata.
    
    return dbPool.execute(SQLQuery, [
        `%${search}%`,
        `%${search}%`
    ]);
};

const filterUsers = (role) => {
    const SQLQuery = `SELECT id, name, role, created_at
                        FROM users WHERE role = ?`
    return dbPool.execute(SQLQuery, [role]);
};

const getUserPagination = (limit, offset) => {
    const SQLQuery = `SELECT id, name, role, created_at
                        FROM users LIMIT ? OFFSET ?`

           return dbPool.execute(SQLQuery, [limit, offset]);
}

export { registerUser, loginUser, getUserById, getAllUsers, 
    deleteUser, updateUser, searchUsers, filterUsers, getUserPagination };

