import express from "express"
import bcrypt from "bcrypt"
import cors from "cors"
import jwt from "jsonwebtoken"
import multer from "multer"
import path from "path"
import { sql } from "./db.js"
import { RoleMiddleWare } from "./roleMiddleware.js"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext)
    }
})

const upload = multer({ storage })
const app = express()
const port = 8080

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

// регистрация
app.post('/reg', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.send({ message: "Не все поля заполнены" })
    }

    const uniqueUsername = await sql`select * from Users where username = ${username}`

    if (uniqueUsername[0]) {
        return res.send({ message: "Данное имя пользователя уже занято, придумайте другое" })
    }

    const hashPass = bcrypt.hashSync(password, 11)
    const newUser = await sql`insert into Users(username, password, roleId) values(${username}, ${hashPass}, 'USER') RETURNING *`

    return res.send({ newUser })
})

// авторизация
app.post('/auth', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.send({ message: "Не все поля заполнены" })
    }

    const user = await sql`select * from Users where username = ${username}`

    if (!user[0]) {
        return res.send({ message: "Пользователь не найден" })
    }

    const token = jwt.sign({ username, roleid: user[0].roleid }, "KEY", { expiresIn: "24h" })

    return res.send({ token, id: user[0].id, roleid: user[0].roleid })
})

// все книги
app.get('/allBooks', async (req, res) => {
    const books = await sql`select * from Books where statusId = 'Принят'`
    res.send({ books })
})

// книга по ид
app.get('/allBooks/:id', async (req, res) => {
    const { id } = req.params
    const book = await sql`select * from Books where id = ${id}`
    res.send({ book: book[0] })
})

// скачивание книги
// app.get('/dowland/:id', async (req, res) => {
//     const { id } = req.params
//     const book = await sql`select file from Books where id = ${id}`
//     const file = path.join('public', book[0])
//     res.send(file)
// })

// книги пользователя для просмотра статуса
app.get('/myBooks/:id', async (req, res) => {
    const { id } = req.params
    const books = await sql`select * from Books where userId = ${id}`
    res.send({ books })
})

// добавление новой книги
app.post('/newBook', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), async (req, res) => {
    const { name, author, text, userId } = req.body
    const image = req.files['image'] ? req.files['image'][0].filename : null
    const file = req.files['file'] ? req.files['file'][0].filename : null

    console.log(req.files);

    try {
        const newBook = await sql`insert into Books(name, author, image, file, text, userId, statusId) values(${name}, ${author}, ${image}, ${file}, ${text}, ${userId}, 'В обработке') returning *`
        res.send({ newBook })
    } catch (error) {
        console.log(error);
        res.send({ error })
    }
})

// заявки для админа
app.get('/req', RoleMiddleWare(["ADMIN"]), async (req, res) => {
    const requests = await sql`select * from Books where statusId = 'В обработке'`
    res.send({ requests })
})

// изменение статуса книги
app.patch('/status', RoleMiddleWare(['ADMIN']), async (req, res) => {
    const { id, statusId } = req.body
    const update = await sql`update Books set statusId = ${statusId} where id = ${id} returning *`
    res.send({ update })
})

const start = async () => {
    await sql`create table if not exists Roles(
        id VARCHAR(255) UNIQUE NOT NULL
    )`

    await sql`create table if not exists Statuses(
        id VARCHAR(255) UNIQUE NOT NULL
    )`

    await sql`create table if not exists Users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        roleId VARCHAR(255) NOT NULL,
        FOREIGN KEY (roleId) references Roles(id)
    )`

    await sql`create table if not exists Books(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        file VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        fromAdmin TEXT,
        userId INT NOT NULL,
        statusId VARCHAR(255) NOT NULL,
        FOREIGN KEY (userId) references Users(id),
        FOREIGN KEY (statusId) references Statuses(id)
    )`

     // await sql`INSERT INTO Roles(id) VALUES('ADMIN'), ('USER')`
     // await sql`INSERT INTO Statuses(id) VALUES('В обработке'), ('Принят'), ('Отклонен')`

    app.listen(port, () => {
        console.log(`СЕРВЕР РАБОТАЕТ НА ПОРТУ ${port}`);
    })
}

start()