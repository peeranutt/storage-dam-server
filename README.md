# Storage Server

Simple file storage server built with Node.js and Express.

## Features

- File upload via multipart/form-data
- File download
- CORS enabled
- Health check endpoint

## Endpoints

- `POST /storage/upload` - Upload a file
- `GET /storage/file/:filename` - Download a file
- `GET /health` - Health check

## Running on Host Machine

To run directly on the host machine (recommended for accessing via actual IP):

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Run the first storage server on port 3000:
   ```bash
   HOST=10.0.11.25 PORT=3000 npm start
   ```

4. Run the second storage server on port 3000 (different machine or different port):
   ```bash
   HOST=10.0.11.26 PORT=3000 npm start
   ```

## Running with Docker

If you prefer Docker:

```bash
docker build -t storage-server .
docker run -p 3000:3000 -e HOST=10.0.11.25 storage-server
```

Note: For Docker, you may need to configure networking to expose the container on the host IP.