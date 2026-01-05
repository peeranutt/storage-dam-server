import express from 'express';
import multer from 'multer';
import cors from 'cors';
import * as path from 'path';
import * as fs from 'fs';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOST = process.env.HOST || 'localhost';

// Enable CORS
app.use(cors());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Keep original filename
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Upload endpoint
app.post('/storage/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `http://${HOST}:${PORT}/storage/file/${req.file.filename}`;
  res.json({
    success: true,
    message: 'File uploaded successfully',
    filename: req.file.filename,
    fileUrl: fileUrl
  });
});

// Download endpoint
app.get('/storage/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.sendFile(filePath);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Storage server running on http://${HOST}:${PORT}`);
});