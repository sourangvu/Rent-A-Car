import express from 'express'
import { connectDB } from './config/db.js'
import { apiRouter } from './routes/index.js'
import cookieParser from 'cookie-parser'
import cors from "cors"
const app = express()
const port = 3000

connectDB()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
              origin:["http://localhost:5173", "https://rent-a-car-client.vercel.app"],
              credentials:true, 
              methods:["GET", "POST", "PUT", "DELETE", "OPTION"] })),

app.get('/', (req, res, next) => {
  res.send('Hello World!')
})

//apiRouter for all /api paths
app.use("/api", apiRouter)

app.all("*", (req, res) => {
  return res.status(404).json({ message: "Endpoint Does Not Exist" })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})