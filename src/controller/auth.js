import * as AuthModel from "../models/auth.js";
import bcrypt from "bcryptjs";
import { parse } from "dotenv";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    try{
        if(!name || !email || !password){
            return res.status(400).json({
                message: "Nama, Email, password wajib diisi"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await AuthModel.registerUser({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Register berhasil"
        });

    } catch (erorr) {
        console.error(erorr);

        if(erorr.code === "ER_DUP_ENTRY"){
            return res.status(409).json({
                message: "Email sudah terdaftar"
            });
        }

        res.status(500).json({
            message: "Server Erorr"
        });
    }
}

const loginUser = async (req, res) => {
    //Mengambil data dari request
    const {email, password} = req.body

    try{
        if(!email || !password) {
            return res.status(400).json({
                message: "Email dan password wajib diisi"
            });
        }

        //Mencari pengguna di database
        const [data] = await AuthModel.loginUser(email);

        //Memeriksa apakah email ditemukan
        if(data.length === 0) {
            return res.status(401).json({
                message: "Email atau password salah"
            });
        }

        //. Mengambil data pengguna
        //Karena hasil pencarian email hanya mengambil 
        // pengguna yang cocok, kita mengambil data pertama.
        const user = data[0];

        //Memeriksa password
        //isMatch: hasil pemeriksaan berupa true atau false.
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch){
            return res.status(401).json({
                message: "Email atau password salah"
            })
        }

        //membuat JWT
        const token = jwt.sign(
            {
                 id: user.id,
                 email: user.email,
                 role: user.role
            },
             process.env.JWT_SECRET,
            {
                 expiresIn: process.env.JWT_EXPIRES_IN || "1h"
            }
        );

        //Mengirim response
        //Kita hanya mengirim informasi pengguna yang 
        // diperlukan. Password tidak boleh dikirim kembali 
        // dalam response.
        res.status(200).json({
            message: "Login berhasil",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: token
        });

    } catch (erorr) {
        console.error(erorr)

        res.status(500).json({
            message: "Server Erorr"
        })
    }
    
}

//mengambil profile atau melihat
const getProfile = async (req, res) => {
    try{
        //mengambil ID pengguna dari JWT
        const id = req.user.id;

        //mengambil data pennguna dari MYSQL
        const [data] = await AuthModel.getUserById(id);

        //memeriksa apakah pennguna ditemukan
        //Mengambil satu data pengguna
        //Karena pencarian berdasarkan ID hanya
        //  membutuhkan satu pengguna, kita mengambil 
        // data pertama.
        if(data.length === 0){
            return res.status(404).json({
                message: "Pengguna tidak ditemukan"
            });

        }

        //mengirim data profile
        res.status(200).json({
            message: "Berhasil mengambil profile",
            data: data[0]
        });

    } catch (erorr) {
        console.error(erorr);

        res.status(500).json({
            message: "Server Erorr"
        })
    }
}

const getAllUsers = async (req, res) => {
    try{
        const [data] = await AuthModel.getAllUsers();

        res.status(200).json({
            message: "Berhasil mengambil seluruh data pengguna",
            data: data
        })

    } catch (erorr) {
        console.error(erorr);

        res.status(500).json({
            message: "Server Erorr"
        })
    }
}

const deleteUser = async (req, res) => {
    //Contohnya, ketika kita mengakses:
    // DELETE /auth/admin/users/2
    const {id} = req.params;

    try{
        const [result] = await AuthModel.deleteUser(id);

        //Memeriksa apakah pengguna ditemukan
        if(result.affectedRows === 0){
            return res.status(404).json({
                message: "Pengguna tidek ditemukan"
            });
        }

        res.status(200).json({
            message: "Berhasil menghapus pengguna"
        });

    } catch (erorr){
        console.error(erorr);

        res.status(500).json({
            message: "Server Erorr"
        })
    }
}

const updateUser = async (req, res) => {
    //req.params mengambil ID pengguna dari URL.
    const {id} = req.params;
    //req.body mengambil nama dan email baru.
    const {name, email} = req.body;

    try{
        if(!name || !email){
            return res.status(400).json({
                message: "Nama dan email wajib diisi"
            });
        }

    const [result] = await AuthModel.updateUser(
        {name, email},
        id
    );

    //affectedRows === 0 berarti tidak ada baris yang 
    // berhasil diubah.
    if(result.affectedRows === 0){
        return res.status(404).json({
            message: "Pennguna tidak ditemukan"
        });
    }

    res.status(200).json({
        message: "Berhasil mengubah data pengguna",
        data: {
            id,
            name,
            email
        }
    });

    } catch (erorr) {
        console.error(erorr);

        res.status(500).json({
            message: "Server Erorr"
        });
    }
};

const searchUsers = async (req, res) => {
    //Mengambil parameter pencarian
    //Mengambil nilai search dari URL.
    const {search} = req.query;

    try{
        if(!search)
            return res.status(400).json({
                message: "Parameter search wajib diisi"
        })

        const [data] = await AuthModel.searchUsers(search);

        res.status(200).json({
            message: "Berhasil mencari pengguna",
            data: data

        })

    } catch (erorr) {
        console.error(erorr)

        res.status(500).json({
            message: "Server Erorr"
        })
    }
}

const filterUsers = async (req, res) => {
    const { role } = req.query;

    try{
        if(!role) {
            return res.status(400).json({
                message: "Parameter role wajib diisi"
            });
        }

        if(!["admin", "user"].includes(role)){
            return res.status(400).json({
                message: "Role harus admin atau user"
            });
        }

        const [data] = await AuthModel.filterUsers(role);

        res.status(200).json({
            message: "Berhasil filter pengguna",
            data: data
        })

    } catch (erorr) {
        console.error(erorr);

        res.status(500).json({
            message: "Server Erorr"
        });
    }
};

const getUsersPagination = async (req, res) => {
    //Mengambil nomor halaman
    const page = parseInt(req.query.page) || 1;
    //	Mengambil jumlah data per halaman
    const limit= parseInt(req.query.limit) || 5;

    try{
        if(page <1 || limit <1){
            return res.status(400).json({
                message: "page dan limit harus lebih dari 0"
            });
        }

        const offset = (page - 1) * limit;

        const [data] = await AuthModel.getUserPagination(
            limit,
            offset
        );

        res.status(200).json({
            message: "Berhasil mengambil data pengguna",
            page,
            limit,
            data
        });

    } catch (error) {
        console.error(error)

            res.status(500).json({
                message: "Server error"
            })
    }
}

export { registerUser, loginUser, getProfile,
     getAllUsers, deleteUser, updateUser, searchUsers, filterUsers, getUsersPagination};