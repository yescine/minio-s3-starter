import { Router } from "express";
import { minioClient } from "../../src/index";
import multer from "multer";
import { UploadedObjectInfo } from "minio";
const router = Router();
const bucket = "test-dev"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const name = `${uniqueSuffix}-${file.originalname}`;
    cb(null, name);
  },
});
const fUpload = multer({ storage });

router.get("/file", (req, res, next) => {
  res.render("minio/singleFile");
});

router.post("/file", fUpload.single("file"), async (req, res, next) => {
  console.log({ body: req.body, file: req.file });
  const { path, filename } = req.file;
  const metaData = {
    "Content-Type": "application/octet-stream",
    "X-Amz-Meta-Testing": 1234,
    example: 5678,
    project: "e-erp-test",
  };
  const result: UploadedObjectInfo = await new Promise((resolve, reject) => {
    minioClient.fPutObject(bucket, filename, path, metaData, (err, result) => {
      if (err) console.log(err);
      resolve(result);
    });
  });
  const message = `file ${filename} uploaded with etag = ${result.etag}`;
  console.log(message);
  res.send({ message });
});

router.post("/files", fUpload.array("files",5), async (req, res, next) => {
  // console.log({ body: req.body, file: req.files });
  const files = req.files
  // @ts-ignore
  files.forEach(async(file,idx)=>{
    const metaData = {
      "Content-Type": "application/octet-stream",
      "X-Amz-Meta-Testing": 1234,
      example: 5678,
      project: "e-erp-test",
    };
    const result: UploadedObjectInfo = await new Promise((resolve, reject) => {
      minioClient.fPutObject(bucket, `avatar/${file.filename}`, file.path, metaData, (err, result) => {
        if (err) console.log(err);
        resolve(result);
      });
    });
    const message = `file ${file.filename} uploaded with etag = ${result.etag}`;
    console.log(message);
  })
  // @ts-ignore
  const message = `uploaded: ${files.map(file=>file.filename).join('-')}`
  res.send({ message });
});

router.get("/object", (req, res, next) => {
  const {fileName,etag} = req.query
  res.render('minio/object')
  minioClient.statObject(bucket,fileName.toString(),(err,stat)=>{
    if(err) console.log(err)
    console.log({stat})
  })
  minioClient.presignedGetObject(bucket,fileName.toString(),(err,url)=>{
    if(err) console.log(err)
    console.log({url})
  })
});

router.get("/file_test", (req, res, next) => {
  const fileName = (req.query.fileName || "pdf-document") as string;
  const objTestPath = "C:/Users/bouch/Documents/cooltool-benchmark-12-08-2022.pdf";
  const metaData = {
    "Content-Type": "application/octet-stream",
    "X-Amz-Meta-Testing": 1234,
    example: 5678,
    project: "e-erp",
  };
  minioClient.fPutObject("test-dev", fileName, objTestPath, metaData, (err, result) => {
    if (err) console.log(err);
    console.log(`${fileName} uploaded successfully`);
  });
  res.send("sent file");
});

export default router;
