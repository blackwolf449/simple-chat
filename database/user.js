import mongoose from 'mongoose'

const User = mongoose.model(
    'User',
    new mongoose.Schema({
        name: String,
        password: String,
    })
)

export async function create(username, password) {
    const user = new User(username, password)
    await user.save()
    return user
}

export function find(obj) {
    return User.find(obj)
}

export async function findByNameAndPassword(username, password) {
    const user = await User.find({
        name: username,
        password: password,
    })
    let authorized = false
    if (user.length <= 0) return authorized
    for (let i = 0; i < user.length; i++) {
        if (
            user[i].toObject().name == username &&
            user[i].toObject().password == password
        ) {
            authorized = true
        }
    }
    return authorized
}
