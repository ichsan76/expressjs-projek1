import express from "express";
import { registerUser, loginUser, getProfile,
     getAllUsers, deleteUser, updateUser,  searchUsers, filterUsers, getUsersPagination} from "../controller/auth.js";
import { authenticateToken } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { getUserPagination } from "../models/auth.js";


const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

//// Endpoint yang membutuhkan JWT
router.get("/profile", authenticateToken, getProfile);

// Mengambil semua pengguna
// http://localhost:4001/auth/admin/users
router.get("/admin/users",authenticateToken,authorizeRole("admin"),getAllUsers);

//// Mencari pengguna
// http://localhost:4001/auth/admin/users/search?search=dimas
//GET http://localhost:4001/auth/admin/users/search
router.get("/admin/users/search", authenticateToken, authorizeRole("admin"),  searchUsers);

//GET /auth/admin/users/filter?role=admin
router.get("/admin/users/filter", authenticateToken, authorizeRole('admin'), filterUsers);

//http://localhost:4001/auth/admin/users/pagination?page=1&limit=5
router.get("/admin/users/pagination", authenticateToken, authorizeRole("admin"),  getUsersPagination)

router.delete("/admin/users/:id", authenticateToken, authorizeRole("admin"), deleteUser);

// http://localhost:4001/auth/admin/users/3
router.patch("/admin/users/:id", authenticateToken, authorizeRole("admin"), updateUser);

export default router;