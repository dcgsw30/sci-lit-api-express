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

// Search for Literature by Title
app.get('/documents/search', (req, res, next) =>{
  const providedTitle = req.query.title;

  if(!providedTitle){
    return res.status(400).send('No input found')
  }

  const wantedDocument = documents.find((document) => document.title=== providedTitle);

  if (!wantedDocument){
    return res.status(400).send('Document not found')
  }

  res.json([wantedDocument]);

});

// Filter by progress
app.get('/documents/searchProgress', (req, res, next) =>{
  const providedProgress = req.query.progress;

  if(!providedProgress ){
    return res.status(400).send('No input found')
  }

  const wantedDocuments = documents.filter((document) => document.progress === providedProgress);

  if (wantedDocuments.length === 0){
    return res.status(400).send('Document not found')
  }

  res.json(wantedDocuments);

});

// Add New Literature
app.post('/documents', (req, res, next) =>{
  const newDocument = req.body;
  documents.push(newDocument);
  res.json(documents);
});

// Delete New Literature
app.delete('/documents/:title', (req, res, next) => {
  const documentTitle = req.params.title;
  const removedDocument = documents.find((document) => document.title === documentTitle);

  if (!removedDocument){
    return res.status(404).send(`No document with title: ${documentTitle}`)
  }
  documents = documents.filter((document) => document.title !== documentTitle);
  res.json(documents);
});

app.put('/documents/:title', (req, res, next) =>{
  const titleToUpdate = req.params.title;
  const updatedDocument = req.body;

  const documentToUpdate = documents.find((doc) => doc.title === titleToUpdate);

  if(!documentToUpdate){
    return res.status(404).send('Document not found');
  }
  const indexOfUpdatedDocument = documents.indexOf(documentToUpdate);
  
  //debugging console logs
  console.log('Before Update:', documents[indexOfUpdatedDocument]);
  console.log('Updating with:', updatedDocument);

  documents[indexOfUpdatedDocument] = updatedDocument;

  console.log('After Update:', documents[indexOfUpdatedDocument]);

  res.json(documents);

});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
