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
      const progress = document.getElementById('readingProgress').value;
  
      const newDocument ={
        title: title,
        author: author,
        link: link,
        type: type,
        assignment: assignment,
        progress: progress
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

    //helper function that returns suitable class name
    const getProgressClassName = (progress) =>{
      if (progress === 'Not Started'){
        return 'not-started';
      } else if (progress === 'In Progress'){
        return 'in-progress';
      } else if (progress === 'Completed'){
        return 'completed';
      } else{
        return '';
      }
    }

    //helper function to display list
    const displayAllDocuments = (documentData) => {
      resetDisplaySection();
      if (documentData.length > 0) {
        documentData.forEach((doc, index) => {

          const newRow = literatureListSection.insertRow();
          newRow.className = index % 2 === 0 ? 'even' : 'odd';

          const progressClassName = getProgressClassName(doc.progress); 

          const cellTitle = newRow.insertCell(0);
          cellTitle.textContent = doc.title;

          const cellAuthor = newRow.insertCell(1);
          cellAuthor.textContent = doc.author;

          const cellLink = newRow.insertCell(2);
          cellLink.textContent = doc.link;

          const cellType = newRow.insertCell(3);
          cellType.textContent = doc.type;

          const cellAssignment = newRow.insertCell(4);
          cellAssignment.textContent = doc.assignment;

          const cellProgress = newRow.insertCell(5);
          cellProgress.textContent = doc.progress;
          cellProgress.classList.add(progressClassName);

          const cellActions = newRow.insertCell(6);

          const cellEditButton = document.createElement('button');
          cellEditButton.className = 'small-edit-button';
          cellEditButton.textContent = 'Edit';
          cellEditButton.addEventListener('click', (event)=> { //!!! TODO CREATE HELPERS
            editData(event);
          });
          cellActions.appendChild(cellEditButton);
          
          const cellDeleteButton = document.createElement('button');
          cellDeleteButton.className = 'small-delete-button';
          cellDeleteButton.textContent = 'Delete';
          cellDeleteButton.addEventListener('click', () =>{  //!!! TODO CREATE HELPERS
            console.log('Delete Button clicked');
          });
          cellActions.appendChild(cellDeleteButton);
          });
      } else {
        const emptyRow = literatureListSection.insertRow();
        const cell = emptyRow.insertCell(0);
        cell.colSpan = 6;
        cell.textContent = 'No Documents Added';
      }
    };

    //ASYNC edit data function
    const editData = async (event) =>{
      try{
        const rowIndex = event.target.closest('tr').rowIndex;
        const documentIndex = rowIndex - 1;
        const retrievedDocuments = await fetchDocumentHelper();
        const editTargetDocument = retrievedDocuments[documentIndex];

        console.log('Going to udpate the original file:', editTargetDocument);

        const newTitle = prompt('Enter new title:', editTargetDocument.title);
        const newAuthor = prompt('Enter new author:', editTargetDocument.author);
        const newLink = prompt('Enter new link:', editTargetDocument.link);
        const newType = prompt('Enter new type: Choose Book, Journal, or Other', editTargetDocument.type);
        const newAssignment = prompt('Enter new assignment:', editTargetDocument.assignment);
        const newProgress = prompt('Enter new progress: Choose Not Started, In Progress, or Completed!', editTargetDocument.progress);

        const updatedDocument ={
          title: newTitle,
          author: newAuthor,
          link: newLink,
          type: newType,
          assignment: newAssignment,
          progress: newProgress
        };

        const updateResponse = await updateDocument(editTargetDocument.link, updatedDocument);
        console.log("Updated document into:", updateResponse);

      } catch (error) {
        console.error('Error in editData function:', errormessage);
      }
    };

    // fetch helper, returns array from database 
    const fetchDocumentHelper = () =>{
      return fetch('http://localhost:3000/documents')
        .then(response =>{
          if (!response.ok){
            throw new Error ('Failed to fetch')
          }
          return response.json();
        })
        .catch(error =>{
          console.error('Error fetching document:', error.message);
        });
    };

    //PUT request helper, edits the data in the server
    const updateDocument = async (targetDocumentLink, updatedDocument) =>{
      const updateRoute = `http://localhost:3000/documents/${targetDocumentLink}`
      try{
        const response = await fetch (updateRoute, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedDocument),
        });

        //debug console log message
        console.log('PUT Response:', response);

        if(!response.ok){
          throw new Error('Failed to updated');
        }
        return response.json();
      } catch (error) {
        console.error('Error updating document:', error.message);
      }
    };
    
  });


  