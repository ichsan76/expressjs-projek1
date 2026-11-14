import express from "express";
import { authenticateToken } from "../middleware/auth.js";

import { createTodo, getAllTodos, getTodoById,updateTodo, deleteTodo } from "../controller/todos.js";

const router = express.Router();

//menambahkan todo
router.post("/", authenticateToken, createTodo);

//mengambil semua todo
router.get("/", authenticateToken, getAllTodos);

//mengambil todo berdasrkan ID
router.get("/:id", getTodoById);

//mengubah todo seluruhnya
router.put("/:id", authenticateToken, updateTodo);

//menghapus todo
router.delete("/:id", authenticateToken, deleteTodo)

export default router;