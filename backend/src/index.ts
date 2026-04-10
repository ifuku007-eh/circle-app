import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './modules/auth/auth.routes'
import userRoutes from './routes/user.routes'
import threadRoutes from './routes/thread.routes'
import replyRoutes from './routes/reply.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/threads', threadRoutes)
app.use('/api/v1/replies', replyRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})