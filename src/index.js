import "dotenv/config";
import express from "express";
import cors from 'cors';
import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todos.js";

const app = express()
const PORT = process.env.PORT || 4001;

//mengatur cors
app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));

app.use(express.json());

app.use("/auth", authRoutes)
app.use("/todos", todoRoutes)

app.listen(PORT, () => {
    console.log(`Server berjalan diport ${PORT}`);
});