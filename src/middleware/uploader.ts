import multer from "multer";
import { __dirname } from "../utils/utils.ts";

const rootDir = __dirname + "/src/public";
console.log(rootDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, rootDir + "/profile/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = file.originalname + " - " + Date.now();
    cb(null, uniqueName);
  },
});
export const uploader = multer({ storage });
