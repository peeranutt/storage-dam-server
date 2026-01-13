import express from 'express';
import multer from 'multer';
import cors from 'cors';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

const app = express();
const PORT = 3002;

app.use(cors());

const uploadsDir = path.join(__dirname, '../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => {
    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.post('/upload', 
  upload.array('files', 10), 
  (req, res) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const results = files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      fileUrl: `http://${req.hostname}:${PORT}/storage/file/${file.filename}`,
    }));

  res.json({
      success: true,
      count: files.length,
      files: results,
    });
});

app.get('/storage/file/:filename', (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  if (!fs.existsSync(filePath)) return res.sendStatus(404);
  res.sendFile(filePath);
});

app.get('/health', (_, res) => res.json({ status: 'OK' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Storage server running on port ${PORT}`);
});
