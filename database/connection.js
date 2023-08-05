import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export async function connect() {
    await mongoose.connect(process.env.DATABASE_URL)
}
