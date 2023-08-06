import mongoose from 'mongoose'
import crypto from 'crypto'

const User = mongoose.model(
    'User',
    new mongoose.Schema({
        name: String,
        password: String,
    })
)

function hash(value) {
    return crypto.createHash('sha256').update(value).digest('hex')
}

export async function create(username, password) {
    const userExist = await User.find({ name: username })
    if (userExist.length >= 1) {
        return 400
    } else {
        const user = new User({ name: username, password: hash(password) })
        user.save()
        return user
    }
}

export function find(obj) {
    return User.find(obj)
}

export async function findByNameAndPassword(username, password) {
    const user = await User.find({
        name: username,
        password: hash(password),
    })
    let authorized = false
    if (user.length <= 0) return authorized
    for (let i = 0; i < user.length; i++) {
        if (
            user[i].toObject().name == username &&
            user[i].toObject().password == hash(password)
        ) {
            authorized = true
        }
    }
    return authorized
}
