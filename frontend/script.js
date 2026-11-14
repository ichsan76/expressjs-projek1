
// Mengambil elemen Login dan Register



// Kita mengambil elemen HTML berdasarkan atribut id.
const login = document.getElementById('login');
const register = document.getElementById('register');


// Mengambil tombol perpindahan halaman
const showRegister =document.getElementById('showRegister')
const showLogin = document.getElementById('showLogin');

//menampilkan halaman register
showRegister.addEventListener('click', function(event) {
    //Mencegah perilaku bawaan link HTML.Karena link kita 
    // menggunakan href="#", tanpa kode ini browser bisa 
    // mengubah posisi halaman menuju bagian atas.
    event.preventDefault();

    login.classList.remove('active');
    register.classList.add('active');
});

//menampilkan halaman login
showLogin.addEventListener('click', function(event){
    event.preventDefault();

    register.classList.remove('active');
    login.classList.add('active');
});

//mengambil elemen auth dan dashboard
const authContainer = document.querySelector('.auth-container');
const dashboard = document.getElementById('dashboard');
const userName = document.getElementById('userName')

//mengambil form login //mengambil input email dan password
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail')
const loginPassword = document.getElementById('loginPassword');

//proses form login
loginForm.addEventListener('submit', async function(event){
    event.preventDefault();

    //mengambil nilai email dan password
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    try{

        //mengirim data login ke APi //http://localhost:4001/auth/login
        const response = await fetch('http://localhost:4001/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        //mengambil response dari API
        const result = await response.json();

        //memeriksa hasil login
        if(!response.ok){
            alert(result.message);
            return;
        }

        //menyimpam jwt
        localStorage.setItem('token', result.token);

        //menyembunyikan halaman login dan register
        authContainer.style.display = 'none';

        //menampilkan dashboard
        dashboard.classList.add('active');

        //mengambil data profile pengguna
        await getProfile();

        //mengambil semua todo pengguna
        await getTodos();

    } catch (error) {
        console.error('Error Login:', error);
        alert('Tidak dapat terhubung ke server');
    }

});

//proses mengambil profile pengguna
async function getProfile(){
    
    //mengambil jwt dari localstorage
    const token = localStorage.getItem('token');

    try{

        //mengirim jwt ke api
        const response = await fetch('http://localhost:4001/auth/profile', {
            method: 'GET',
            headers: {
                 'Authorization': `Bearer ${token}` //Artinya Front-End mengirimkan JWT kepada Backend melalui Header Authorization.
            }
        });

        //mengambil response dari api 
        const result = await response.json();

        //memeriksa hasil response
        if(!response.ok){
            alert(result.message);
            return;
        }

        console.log('Data Profile:', result.data);
        //menampilkan nama pengguna di dashboard
        userName.textContent = `Halo ${result.data.name}`

    } catch (error){
        console.error('Error Profile:', error);
    }
}


//mengambil tombol logout
const logoutButton = document.getElementById('logoutButton');

//proses logout
logoutButton.addEventListener('click', function(){

    //menyembunyikan dashboard
    dashboard.classList.remove('active') //• muncul atau buka.

    //menampilkan halaman login dan register
    authContainer.style.display = 'flex';

    //menampilkan 
    register.classList.remove('active');
    login.classList.add('active')
})

//mengambil elemen todo
const todoInput = document.getElementById('todoInput');
const todoDescription = document.getElementById('todoDescription');
const addTodoButton =document.getElementById('addTodoButton');
const todoList = document.querySelector('.todo-list');

//fungsi menampilkan todo bertugas membuat dan menampilkan satu Todo ke HTML.
function renderTodo(todo){

    //membuat elemen todo baru
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');

    //menyimpan ID todo
    todoItem.dataset.id = todo.id;

    //membuat judul todo
    const todoTitle = document.createElement('h3');
    todoTitle.textContent = todo.title;
    todoItem.appendChild(todoTitle);

    //membuat deskripsi todo
    const todoDesc = document.createElement('p');
    todoDesc.textContent = todo.description;
    todoItem.appendChild(todoDesc);

    //membuat status todo
    const todoStatus = document.createElement('span');
    todoStatus.classList.add('todo-status', todo.status);

    todoStatus.textContent = todo.status === 'completed'
        ? 'Selesai'
        : 'Tertunda';

        todoItem.appendChild(todoStatus);

        //membuat tombol aksi
        const todoActions = document.createElement('div')
        todoActions.classList.add('todo-actions')

        //membuat tombol selesai
        const completeButton = document.createElement('button');
        completeButton.type = 'button';
        completeButton.textContent = todo.status === 'completed'
            ? 'Tertunda'
            : 'Selesai';
        completeButton.classList.add('completed-button')

        //membuat tombol edit
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');

        //membuat tombol hapus
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Hapus';
        deleteButton.classList.add('delete-button');

        //menambahkan tombol ke dalam todo
        todoActions.appendChild(completeButton);
        todoActions.appendChild(editButton);
        todoActions.appendChild(deleteButton);

        //menambahkan action class kedalam Item class
        todoItem.appendChild(todoActions);

        //menambahkan todo kedalam daftar
        todoList.appendChild(todoItem);
}

//bertugas membuat dan menampilkan satu Todo ke HTML.
//memanggil renderTodo() untuk setiap Todo.
//proses mengambil semua todo
async function getTodos(){

    //mengambil JWT dari localstorage
    const token = localStorage.getItem('token')

    try{

        //mengirim request ke API
        const response = await fetch('http://localhost:4001/todos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        //mengambil response dari API
        const result = await response.json();

        //memeriksa hasil response
        if(!response.ok){
            alert(result.message);
            return;
        }

        //mengosongkan daftar todo
        todoList.innerHTML = '';

        //menampilkan semua todo
        //Artinya, setiap data Todo yang dikirim Backend 
        // akan ditampilkan satu per satu menggunakan fungsi 
        // renderTodo(). forEach = untukSetiap function
        result.data.forEach(function(todo){
            renderTodo(todo)
        });

        //berfungsi untuk menampilkan isi data dari 
        // backend ke tab Console di browser sebagai alat 
        // bantu pemeriksaan (debugging) bagi programmer.
        console.log('Data Todo', result.data);

    } catch (error){
        console.error('Error mengambil Todo:', error);
        alert('Tidak dapat mengambil data Todo');
    }
    
}

//proses tambah todo
addTodoButton.addEventListener('click', async function(){

    //mengambil nilai dari input
    const todoText = todoInput.value.trim(); // trim Menghapus spasi di awal dan akhir teks
    const descriptionText = todoDescription.value.trim();

   //memeriksa apakah input kosong
if(todoText === ''){
    alert('Judul tidak boleh kosong');
    return;
}

if(descriptionText === ''){
    alert('Deskripsi tidak boleh kosong');
    return;
}

//mengambil jwt dari localstorage
const token = localStorage.getItem('token');

try{

    //memgirim data todo ke API backend
    const response = await fetch('http://localhost:4001/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title: todoText,
            description: descriptionText
        })
    });

    //mengambil response dari API
    const result = await response.json();

    //memeriksa hasil response
    if(!response.ok){
        alert(result.message);
        return;
    }

    console.log('Todo berhasil ditambahkan:', result.data);

    //menampilkan todo yang berhasil disimpan
    renderTodo(result.data);
    
    //mengosongkan input 
    todoInput.value = '';
    todoDescription.value = '';


    } catch(error){
    console.error('Error Tambah Todo:', error);
    alert('Tidak dapat terhubung ke server')
    return;
    }
});
   

//proses mengunah status todo
todoList.addEventListener('click', async function(event){
     console.log('Klik terdeteksi:', event.target);

    //Memeriksa tombol yang diklik
    //contains()Memeriksa apakah class tertentu dimiliki 
    // elemen
    if(event.target.classList.contains('completed-button')){

        //Mengambil Todo dan statusnya
        //closest() mencari elemen induk terdekat yang
        //  memiliki class .todo-item.
        const todoItem = event.target.closest('.todo-item');
        //querySelector() mencari elemen dengan class .todo-status
        //  di dalam Todo yang tadi ditemukan.
        const todoStatus = todoItem.querySelector('.todo-status');

        //mengambil judul dan deskripsi todo
        const todoTitle = todoItem.querySelector('h3');
        const todoDesc = todoItem.querySelector('p');

        //memeriksa status todo, Menentukan status baru
        //Jika status sekarang pending, status baru menjadi 
        // completed. Sebaliknya, jika status sekarang 
        // completed, status baru menjadi pending.
        const newStatus = todoStatus.classList.contains('pending')
            ? 'completed'
            : 'pending';
        
        //mengamil ID todo
        const todoId = todoItem.dataset.id;
        console.log('Elemen Todo:', todoItem);
        console.log('Todo ID:', todoId);
        console.log('Status sekarang:', todoStatus.className);

        //mengambil  JWT dari localstorage
        const token = localStorage.getItem('token');

        try{
            console.log('Todo ID:', todoId);
            console.log('Status baru:', newStatus);
            //console.log('Token:', token);

            //mengirim perunahan status ke API Backend
            const response = await fetch(`http://localhost:4001/todos/${todoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                //Mengirim status ke Backend
                body: JSON.stringify({
                    title: todoTitle.textContent,
                    description: todoDesc.textContent,
                    status: newStatus
                })
            });

            //mengambil response dari API
            const result = await response.json();
            console.log('Status Response:', response.status);
            console.log('Hasil Response:', result);

            //memeriksa hasil response 
            if(!response.ok){
                alert(result.message);
                return;
            }

            //memperbarui status todo
            todoStatus.classList.remove('pending', 'completed');
            todoStatus.classList.add(newStatus);

            //memperbarui teks status
            todoStatus.textContent = newStatus === 'completed'
                ? 'Selesai'
                : 'Tertunda';

            //memperbarui teks tombol
            event.target.textContent = newStatus === 'completed'
                ? 'Tertunda'
                : 'Selesai';

            //memperbarui tampilan todo selesai
            if(newStatus === 'completed'){
                todoItem.classList.add('finished');
            } else {
                todoItem.classList.remove('finished');
            }

            console.log('status Todo berhasil diperbarui');
            console.log('Status Response:', response.status);
            console.log('Hasil Response:', result);

        } catch(error){
            console.error('Error Ubah Status Todo', error);
            alert('Tidak dapat terhubung ke server');
        }
    }
});

//proses edit todo
todoList.addEventListener('click', async function(event){

    //memeriksa status todo
        //contains() Memeriksa apakah class tertentu dimiliki elemen
    if(event.target.classList.contains('edit-button')){

        //Mengambil Todo dan edit
        //closest() mencari elemen induk terdekat yang
        //  memiliki class .todo-item.
        const todoItem = event.target.closest('.todo-item');

        //mengambil judul deskripsi dan status lama
        const todoTitle = todoItem.querySelector('h3');
        const todoDesc = todoItem.querySelector('p');
        const todoStatus = todoItem.querySelector('.todo-status');


        //meminta judul baru
        const newTitle = prompt('Masukkan judul baru:', todoTitle.textContent);

        //memeriksa judul baru
        if(newTitle === null){
            return;
        }

        if(newTitle.trim() === ''){
            alert('Judul tidak boleh kosong');
            return;
        }

        //meminta deskripsi baru
        const newDescription = prompt('masukkan deskripsi baru', todoDesc.textContent);

        //memeriksa dekripsi baru
        if(newDescription === null){
            return;
        }
        
        if(newDescription.trim() === ''){
            alert('Deskrispsi tidak boleh kosong')
            return;
        }

        //mengambil ID todo
        //ID ini berasal dari fungsi renderTodo() yang 
        // sebelumnya kita buat:
        //Jadi, setiap Todo memiliki ID dari MySQL. (todoItem.dataset.id = todo.id;)
        const todoId = todoItem.dataset.id

        //mengambil JWT dari localStorage
        const token = localStorage.getItem('token');

        //mengambil status todo saat ini
        const status = todoStatus.classList.contains('completed')
            ? 'completed'
            : 'pending';

        try{
            //mengirim perubahan todo ke API Backend
            const response = await fetch(`http://localhost:4001/todos/${todoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                //Mengirim tiga data
                body: JSON.stringify({
                    title: newTitle.trim(),
                    description: newDescription.trim(),
                    status: status
                })
            })

            //mengambil response dari API
            const result = await response.json();

            //memeriksa hasil response
            if(!response.ok){
                alert(result.message);
                return;
            }

            //memperbarui tampilan todo
            todoTitle.textContent = newTitle.trim();
            todoDesc.textContent = newDescription.trim();

            alert('Todo berhasil diperbarui');

        } catch (error){
            console.error('Error edit todo:', error);
            alert('Tidak dapat terhubung ke server');
        }

    }
});

//proses hapus todo
todoList.addEventListener('click', async function(event){

    //memeriksa tombol yang diklik
    if(event.target.classList.contains('delete-button')){

        //mengambil elemen todo 
        // Mencari wadah Todo yang memiliki tombol Hapus 
        // tersebut.
        const todoItem = event.target.closest('.todo-item')

        //mengambil ID todo
        //ID ini sudah kita simpan melalui fungsi renderTodo():
        const todoId = todoItem.dataset.id;

        //konfirmasi hapus todo
        const confirmDelete = confirm('Apakah kamu yakin ingin menghapus todo ini?')

        if(!confirmDelete){
            return;
        }

        //mengambil JWT dari localstorage
        const token = localStorage.getItem('token');

        try{

            //mengirim request hapus todo ke API Backend
            const response = await fetch(`http://localhost:4001/todos/${todoId}`,{
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            //mengambil response dari API
            const result = await response.json();

            //memeriksa hasil response
            if(!response.ok){
                alert(result.message);
                return;
            }

            //mengahpus todo dari tampilan 
            //Perintah ini hanya dijalankan jika Backend berhasil 
            // menghapus data dari MySQL.
            todoItem.remove();

            alert('Todo berhasil dihapus');

        } catch (error){
            console.error('Error Hapus Todo:', error);
            alert('Tidak dapat terhubung ke server');
        }
    }
});