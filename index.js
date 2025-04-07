import path from "path";
import express from "express";
import multer from "multer";
import fs from "fs"
import util from "util"

const upload = multer({ dest: "uploads/" })

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

// This line makes the contents of the uploads directory publicly accessible at the /uploads path. 
// If you haven't done this, then the browser won't be able to access the files at '/uploads/filename'.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const JSON_FILE_DATA_PATH = path.join(__dirname, "public", "files.json");
const JSON_FILE_DATA_PATH = path.join(process.cwd(), "public/files.json");

app.post("/upload", upload.single("fileInput"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Plz upload a file" })
    console.log(typeof JSON_FILE_DATA_PATH)
    const fileInput = req.file;
    // console.log(req.file, req.body)
    const fileData = fileInput;
    console.log(fileData)

    const fileInfo = await loadFilesInfo(JSON_FILE_DATA_PATH);
    fileInfo.unshift(fileData);
    await addFile(fileInfo, JSON_FILE_DATA_PATH);

    res.status(201).json({ msg: "File uplaoded successfully" });
  } catch (err) {
    res.status(500).json(err)
  }
})

app.get("/getFiles", async (_req, res) => {
  try {
    const filesInfo = await loadFilesInfo(JSON_FILE_DATA_PATH);
    console.log(filesInfo)
    res.status(200).json(filesInfo)
  } catch (err) {
    res.status(500).json(err)
  }
})

//utility functions to get and add file data 

const readFileAsync = util.promisify(fs.readFile);

async function loadFilesInfo(file) {
  if (!fs.existsSync(file)) return [];

  try {
    const data = await readFileAsync(file, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    throw new Error("Error reading file data");
  }
}


async function addFile(data, file) {
  fs.writeFile(file, JSON.stringify(data, null, 2), err => {
    if (err) throw err;
  })
  // fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8")
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
