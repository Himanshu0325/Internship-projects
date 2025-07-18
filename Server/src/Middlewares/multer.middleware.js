import multer from "multer"


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("multer middleware loaded", storage)
    cb(null, "./Public/temp")
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix) 
    cb(null , file.originalname)
  }
})



 export const upload = multer({  storage })

 // Backend\Public\temp