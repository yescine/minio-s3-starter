import {Router} from 'express'
import {minioClient} from '../../src/index'
const router =  Router()

router.get('/file',(req,res,next)=>{
  const fileName = (req.query.fileName || 'pdf-document' )as string
  const objTestPath = "C:/Users/bouch/Documents/cooltool-benchmark-12-08-2022.pdf"
  const metaData = {
    'Content-Type': 'application/octet-stream',
    'X-Amz-Meta-Testing': 1234,
    'example': 5678,
    'project':'e-erp'
}
  minioClient.fPutObject('test-dev',fileName,objTestPath,metaData,(err,result)=>{
    if(err) console.log(err)
    console.log(`${fileName} uploaded successfully`)
  })
  res.send('sent file')
})

router.post('/file',(req,res,next)=>{
  res.send('received file')
})

export default router