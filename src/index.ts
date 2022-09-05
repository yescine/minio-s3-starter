import  express from 'express'
import allRoute from './routes'
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.use('/api',...allRoute)

const PORT = 5000
app.listen(PORT,()=>{
  console.log(`minio client listening on ${PORT}`)
})