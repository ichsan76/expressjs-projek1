import "dotenv/config";
import express from "express";
import cors from 'cors';
import path from "node:path";
import { fileURLToPath } from "node:url";


import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todos.js";

const app = express()
const PORT = process.env.PORT || 4001;

//menentukan lokasi folder src
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//mengatur cors
app.use(cors());

///app.use(cors({
    ///origin: 'http://127.0.0.1:5500'
///}));

app.use(express.json());

//menampilkan frontend melalui express
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRoutes)
app.use("/todos", todoRoutes)

app.listen(PORT, () => {
    console.log(`Server berjalan diport ${PORT}`);
});