document.addEventListener('DOMContentLoaded', () =>{
  
    const inputForm = document.getElementById('inputForm');
    const viewButton = document.getElementById('viewButton');
    const searchButton = document.getElementById('searchButton');
  
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
        if (!response.ok){
          throw new Error('No network Response');
        }
        return response.json();
      })
      .then(newDocumentData =>{
        console.log('Document added', newDocumentData);
        displayerServerResponse(`Document added: ${newDocumentData.title}`); //!!! requires helper function
      })
      .catch(error =>{
        //console.error('Error:', error);
        displayerServerResponse(`Error adding document: ${error.message}`);
      });
      
      inputForm.reset(); // clear form
    });  
    
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
        displayerServerResponse(`Document data: ${documentData}`);
      })
      .catch(error =>{
        console.error('Error:', error);
        displayerServerResponse(`Error getting documents: ${error.message}`);
      });
    });
  
    searchButton.addEventListener('click', ()=>{
      const searchTerm = document.getElementById('searchInput').value; //used for query
      const serverUrl = 'http://localhost:3000/documents/search';
      const serverUrlQuery = `${serverUrl}?query=${searchTerm}`;
  
      fetch(serverUrlQuery)
      .then(response => {
        if (!response.ok){
          throw new Error('No network response');
      }
        return response.json();
      })
      .then(documentData => {
        displaySearchResults(documentData); // !!! requires helper function
      })
    });
    
  });

//helper function to display server response
function displayerServerResponse(message){
    const serverResponse = document.getElementById('serverResponse');
    serverResponse.textContent = message;
}

//helper function to display list
function displayDocumentData(documentData){
    const literatureListSection = document.getElementById('literatureList');
    const ul = document.createElement('ul');

    documentData.forEach(document =>{
        const li = document.createElement('li');
        li.textContent= `Title: ${document.title}, Author: ${document.author}, Link: ${document.link}, Type: ${document.type},
         Assignment: ${document.assignment}, Notes: ${document.notes}`;
        ul.appendChild(li);
    });
    literatureListSection.appendChild(ul);
}
  