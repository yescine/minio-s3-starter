import {Router} from 'express'

const router =  Router()

router.get('/file',(req,res,next)=>{
  res.send('sent file')
})

router.post('/file',(req,res,next)=>{
  res.send('received file')
})

export default router