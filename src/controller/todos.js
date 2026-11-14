import * as TodoModel from "../models/todos.js";

//menemukan todo
const createTodo = async (req, res) => {
   const {id} = req.user;
    const {title, description} = req.body;

    try{
        const [data] = await TodoModel.createTodo(id, title, description);

        res.status(201).json({
            message: "Todo berhasil ditambahkan",
            data: {
                id: data.insertId,//Mengirim data ke Model untuk disimpan ke MySQL.
                title,
                description,
                status: "pending"
            }
        })

    } catch (error){
        res.status(500).json({
            message: "Gagal menambahkan Todo",
            error: error.message
        });
    }
};

//mengambil semua todo
const getAllTodos = async (req, res) => {
    try{
        const user_id = req.user.id

        const [data] = await TodoModel.getAllTodos(user_id);

        res.status(200).json({
            message: "Berhasil mengambil semua todo",
            data 
        })

    } catch (error) {
        res.status(500).json({
            message: "Gagal Mengambil Todo",
            error: error.message
        })
    }
}

//mengambil todo berdasarkan ID
const getTodoById = async (req, res) => {
    const {id} = req.params;

    try{
        const [data] = await TodoModel.getTodoById(id);

        if(data.length === 0){
            return res.status(404).json({
                message: "Todo tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Berhasil mengambil todo",
            data: data[0]
        })

    } catch (error){
        res.status(500).json({
            message: "Gagal mengambil todo",
            error: error.message
        })
    }
}


 //mengubah todo
const updateTodo = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const { title, description, status } = req.body;

    console.log("ID Todo:", id);
    console.log("User ID:", user_id);
    console.log("Data yang diterima:", req.body);

    try {
        //memeriksa status yang dikirim
        if (!title || !description || !['pending', 'completed'].includes(status)) {
            return res.status(400).json({
                message: "Data Todo tidak valid"
            });
        }

        const [data] = await TodoModel.updateTodo(
            id,
            user_id,
            { title, description, status }
        );

        console.log("Hasil Update:", data);

        if (data.affectedRows === 0) {
            return res.status(404).json({
                message: "Todo tidak ditemukan atau bukan milik pengguna"
            });
        }

        res.status(200).json({
            message: "Todo berhasil diperbarui",
            data: {
                id,
                title,
                description,
                status
            }
        });

    } catch (error) {
        console.error("Error Update Todo:", error);

        res.status(500).json({
            message: "Gagal memperbarui Todo",
            error: error.message
        });
    }
};


//menghapus todo
const deleteTodo = async (req, res) => {
    const {id} = req.params;
    const user_id = req.user.id;

    try{
        const [data] = await TodoModel.deleteTodo(id, user_id);

        //Memeriksa apakah data berhasil ditemukan dan diperbarui.
        if(data.affectedRows === 0) {
            return res.status(404).json({
                message: "Todo tidak ditemukan"           
             });
        }

        res.status(200).json({
            message: "Todo berhasil dihapus"
        })

    } catch (error){
        res.status(500).json({
            message: "Gagal menghapus todo",
            error: error.message
        })
        
    }
}

export{
    createTodo,
    getAllTodos,
    getTodoById,
    updateTodo,
    deleteTodo
}