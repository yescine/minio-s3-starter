import  express from 'express'
import {Client as MinioClient} from 'minio'
import dotenv from 'dotenv'
import path from 'path'
import allRoute from './routes'

dotenv.config();

const app = express()
app.use(express.json())

export const minioClient = new MinioClient({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_USER,
  secretKey: process.env.MINIO_PASSWORD
});

app.get('/', function (req, res) {
  res.render('home')
})

app.set('views', path.join('./src/views'));
app.set('view engine', 'ejs');
app.use('/api',...allRoute)

const PORT = 5000
app.listen(PORT,()=>{
  // console.log({env:process.env.MINIO_USER})  
  console.log(`minio client listening on ${PORT}`)
})