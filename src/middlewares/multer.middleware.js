import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 3e9)
    // cb(null, file.filename + "-" + uniqueSuffix);
    cb(null, file.originalname)
  }
})


export const upload = multer({ storage: storage });