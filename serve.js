import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { connect } from './database/connection.js'
import { create, findByNameAndPassword, find } from './database/user.js'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())
const server = http.createServer(app)
const io = new Server(server)
connect()

dotenv.config()

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.post('/user', async (req, res) => {
    try {
        const login = await findByNameAndPassword(
            req.body.username,
            req.body.password
        )
        if (!login) return res.status(400).json(login)
        res.status(200).json(login)
    } catch (e) {
        res.status(400).json({ message: e })
    }
})

server.listen(process.env.PORT || 3000)

io.on('connection', (socket) => {
    socket.on('chat message', async (msg, user) => {
        const userVerify = await find({ name: user })
        if (userVerify.length <= 0) {
            io.emit('error', 'You can not do that')
        } else {
            io.emit('chat message', user + ': ' + msg)
        }
    })
})
