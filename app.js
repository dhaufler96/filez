import express from "express";
import { getFiles, createFile } from "#db/queries/files";
import { getFolders, getFolder } from "#db/queries/folders";

const app = express();
app.use(express.json());

app.get("/files", async (req, res) => {
  const files = await getFiles();
  res.json(files);
});

app.get("/folders", async (req, res) => {
  const folders = await getFolders();
  res.json(folders);
});

app.get("/folders/:id", async (req, res) => {
  const folder = await getFolder(req.params.id);
  if (!folder) return res.sendStatus(404);
  res.json(folder);
});

app.post("/folders/:id/files", async (req, res) => {
  const folder = await getFolder(req.params.id);
  if (!folder) return res.sendStatus(404);

  const { name, size } = req.body ?? {};
  if (!name || !Number.isInteger(size) || size < 0) {
    return res.sendStatus(400);
  }

  const file = await createFile({
    name,
    size,
    folder_id: folder.id,
  });
  res.status(201).json(file);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

export default app;
