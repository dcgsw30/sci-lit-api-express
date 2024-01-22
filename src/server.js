const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// database array to store all documents
let documents = [];

//cors middleware
app.use(cors());

// Json Parser Middleware
app.use(bodyParser.json());

// Display List
app.get('/documents', (req, res, next) =>{
  res.json(documents);
});

// Search for Literature
app.get('/documents/search', (req, res, next) =>{
  const providedLink = req.query.link;

  if(!providedLink){
    return res.status(400).send('No input found')
  }

  const wantedDocument = documents.find((document) => document.link === providedLink);

  if (!wantedDocument){
    return res.status(400).send('Document not found')
  }

  res.json(wantedDocument);

});

// Add New Literature
app.post('/documents', (req, res, next) =>{
  const newDocument = req.body;
  documents.push(newDocument);
  res.send(`The document ${newDocument.title} has been added!`)
});

// Delete New Literature
app.delete('/documents/:link', (req, res, next) => {
  const documentLink = req.params.link;
  const removedDocument = documents.find((document) => document.link === documentLink);

  if (!removedDocument){
    return res.status(404).send(`No document with link/doi: ${documentLink}`)
  }
  documents = documents.filter((document) => document.link !== documentLink);
  res.send(`The document with link/doi: ${removedDocument.title} has been removed`)
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
