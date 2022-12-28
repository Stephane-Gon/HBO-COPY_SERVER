import dotenv from 'dotenv';
dotenv.config()

import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import connectDb from './config/connectDB.js';
import corsOptions from './config/corsOptions.js';

import credentials from './middlewares/credentialsMiddleware.js'

import { router as authRouter } from './routes/authRoutes.js';
import { router as userRouter } from './routes/usersRoutes.js';
import { router as profileRouter } from './routes/profileRoutes.js'
import { verifyJwt } from './middlewares/verifyJwt.js';

const app = express()
const PORT = process.env.PORT

connectDb()

// Handle options credentials check -before CORS;
// and fetch cookies credentials requirement
app.use(credentials)

// Cors Middleware
app.use(cors(corsOptions))

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded( {limit: '30mb', extended:true }))

// Middleware for cookies
app.use(cookieParser())

// ROUTES
app.use('/auth', authRouter)
app.use('/users', userRouter)

app.use(verifyJwt)
app.use('/profile', profileRouter)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}!`))
})