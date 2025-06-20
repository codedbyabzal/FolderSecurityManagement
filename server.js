const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const app = express();
const upload = multer();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = 'secure-data';

// Initialize Blob Service Client
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

app.use(express.static('public'));

// Upload file to Azure Blob Storage
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const blobName = req.file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(req.file.buffer, req.file.buffer.length);

    res.status(200).send('File uploaded successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file.');
  }
});

// Get list of files in the container
app.get('/files', async (req, res) => {
  try {
    const blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push({ name: blob.name });
    }
    res.json(blobs);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).send('Error fetching files.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
