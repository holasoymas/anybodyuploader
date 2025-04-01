import path from "path";
import express from "express";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));








app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
