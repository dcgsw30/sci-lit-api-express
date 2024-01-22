document.addEventListener('DOMContentLoaded', () =>{
    
    //constants for html elements
    const inputForm = document.getElementById('inputForm');
    const viewButton = document.getElementById('viewButton');
    const searchButton = document.getElementById('searchButton');
    const deleteButton = document.getElementById('deleteButton');
    const literatureListSection = document.getElementById('literatureListContainer');
  
    inputForm.addEventListener('submit', (event) =>{
      event.preventDefault();
  
      //form values to create json object
      const title = document.getElementById('documentTitle').value;
      const author = document.getElementById('documentAuthor').value;
      const link = document.getElementById('documentLink').value;
      const type = document.getElementById('documentType').value;
      const assignment = document.getElementById('documentAssignment').value;
      const notes = document.getElementById('documentNotes').value;
  
      const newDocument ={
        title: title,
        author: author,
        link: link,
        type: type,
        assignment: assignment,
        notes: notes
      };

  
      //send post request to /document endpoint
      fetch('http://localhost:3000/documents',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // indicate that we are sending json
        },
        body: JSON.stringify(newDocument), // convert json object to JSON string
      })
      .then(response => {
        console.log('Response Status:', response.status);
        if (!response.ok){
          throw new Error('No network Response');
        }
        return response.text();
      })
      .then(newDocumentData =>{
        console.log('Document added', newDocumentData);
      })
      .catch(error =>{
        console.log(`Error adding document: ${error.message}`);
      });
      
      inputForm.reset(); // clear form
    });  
    
    //get request to retrieve everything
    viewButton.addEventListener('click', ()=>{
      //send get request to /documents endpoint
      fetch('http://localhost:3000/documents')
      .then(response => {
        if (!response.ok){
          throw new Error('No network Response');
        }
        return response.json();
      })
      .then(documentData =>{
        console.log('Document data', documentData);
        displayAllDocuments(documentData);
      })
      .catch(error =>{
        //console.error('Error:', error);
        console.log(`Error getting documents: ${error.message}`);
      });
    });

    //search Button
    searchButton.addEventListener('click', ()=>{
      const searchTerm = document.getElementById('searchInput').value; //used for query
      const serverUrl = 'http://localhost:3000/documents/search';
      const serverUrlQuery = `${serverUrl}?link=${searchTerm}`;
  
      fetch(serverUrlQuery)
      .then(response => {
        if (!response.ok){
          throw new Error('No network response');
      }
        return response.json();
      })
      .then(documentData => {
        console.log('Fetched document data:', documentData);
        displayAllDocuments([documentData]); // !!! requires helper function
      })
      .catch(error => {
        console.log(`Error processing response: ${error.message}`)
      })
    });

    //delete Button
    deleteButton.addEventListener('click', () => {
      const deleteTerm = document.getElementById('deleteInput').value.trim();  // Trim to remove leading/trailing whitespaces
      const serverUrl = 'http://localhost:3000/documents/';
    
      if (deleteTerm) {
        const deleteUrl = `${serverUrl}${deleteTerm}`;
    
        // Perform DELETE request
        fetch(deleteUrl, {
          method: 'DELETE',
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('No network response');
            }
            return response.text();
          })
          .then((result) => {
            console.log('Document deleted:', result);
          })
          .catch((error) => {
            console.log(`Error deleting document: ${error.message}`);
          });
      } else {
        console.log('Invalid delete term. Provide a valid link.');
      }
    });

    //helper function to reset literaturelist
    const resetDisplaySection = () =>{
      literatureListSection.innerHTML = '';
    }


    //helper function to display list
    const displayAllDocuments = (documentData) => {
        resetDisplaySection();
        if (documentData.length > 0){
          documentData.forEach(doc =>{
            const newDocument = document.createElement('div');
            newDocument.className = 'single-doc';
            newDocument.innerHTML = `<div class= "title"> ${doc.title}</div>`;
            //newDocument.textContent = doc.title;
            literatureListSection.appendChild(newDocument);
          })
        } else{
          literatureListSection.innerHTML = '<p> No Documents Added </p>';
        }
    }
    
  });


  