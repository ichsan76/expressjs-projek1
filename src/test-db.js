import "dotenv/config";
import dbPool from "./config/database.js";

const testConnection = async () => {
    try {
        const [rows] = await dbPool.query("SELECT 1 AS hasil");

        console.log("Koneksi MySQL berhasil!");
        console.log(rows);

    } catch (error) {
        console.error("Koneksi MySQL gagal!");
        console.error(error);

    } finally {
        await dbPool.end();
    }
};

testConnection();