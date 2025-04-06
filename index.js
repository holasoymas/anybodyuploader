import path from "path";
import express from "express";
import multer from "multer";
import fs from "fs"

const upload = multer({ dest: "uploads/" })

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

// const JSON_FILE_DATA_PATH = path.join(__dirname, "public", "files.json");
const JSON_FILE_DATA_PATH = path.join(process.cwd(), "public/files.json");

app.post("/upload", upload.single("fileInput"), async (req, res) => {

  if (!req.file) return res.status(400).json({ error: "Plz upload a file" })
  console.log(typeof JSON_FILE_DATA_PATH)
  const fileInput = req.file;
  // console.log(req.file, req.body)
  const fileData = fileInput;
  console.log(fileData)

  const fileInfo = loadFilesInfo(JSON_FILE_DATA_PATH);
  fileInfo.push(fileData);
  addFile(fileInfo, JSON_FILE_DATA_PATH);
})

//utility functions to get and add file data 

function loadFilesInfo(file) {
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf-8"))
  return [];
}

function addFile(data, file) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8")
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
