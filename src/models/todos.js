import dbPool from "../config/database.js";

//menambahkan 
const createTodo = (user_id, title, description) => {
    const SQLQuery = `INSERT INTO todos (user_id, title, description)
                        VALUES (?, ?, ?)`
    return dbPool.execute(SQLQuery, [user_id, title, description]);
};

//mengambil semua todo
const getAllTodos= (user_id) => {
    const SQLQuery = `SELECT * FROM todos WHERE user_id = ?`

    return dbPool.execute(SQLQuery, [user_id])
};

//mengambil todo berdasarkan id
const getTodoById = (id) => {
    const SQLQuery = `SELECT * FROM todos WHERE id = ?`

    return dbPool.execute(SQLQuery, [id]);
}

//mengubah todo
const updateTodo = (id, user_id, body) => {
    const {title, description, status} = body;
    const SQLQuery = `UPDATE todos SET title = ?, description = ?, status = ?
                        WHERE id = ? AND user_id = ?`;
    return dbPool.execute(SQLQuery, [title, description, status, id, user_id])
}

//menghapus todo 
const deleteTodo = (id, user_id) => {
    const SQLQuery = `DELETE FROM todos WHERE id = ? AND user_id = ?`;

    return dbPool.execute(SQLQuery, [id, user_id]);
}

export {createTodo, getAllTodos, getTodoById, updateTodo, deleteTodo};