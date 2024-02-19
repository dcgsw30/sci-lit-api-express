document.addEventListener('DOMContentLoaded', () =>{
    
    //constants for html elements
    const inputForm = document.getElementById('inputForm');
    const viewButton = document.getElementById('viewButton');
    const searchButton = document.getElementById('searchButton');
    const filterProgressButton = document.getElementById('filterProgressButton');
    const literatureListSection = document.getElementById('literatureListContainer');
    
  
    inputForm.addEventListener('submit', (event) =>{
      event.preventDefault();
  
      //form values to create json object
      const title = document.getElementById('documentTitle').value;
      const author = document.getElementById('documentAuthor').value;
      const year = document.getElementById('documentYear').value;
      const link = document.getElementById('documentLink').value;
      const journal = document.getElementById('documentJournal').value;
      const volume = document.getElementById('documentVolume').value;
      const page = document.getElementById('documentPage').value;
      const progress = document.getElementById('readingProgress').value;
  
      const newDocument ={
        title: title,
        author: author,
        year: year,
        link: link,
        journal: journal,
        volume: volume,
        page: page,
        progress: progress
      };

  
      //send post request to /document endpoint
      fetch('http://localhost:3000/documents',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(newDocument), 
      })
      .then(response => {
        console.log('Response Status:', response.status);
        if (!response.ok){
          throw new Error('No network Response');
        }
        return response.json();
      })
      .then(newDocumentData =>{
        console.log('Document added', newDocumentData);
        displayAllDocuments(newDocumentData);
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

    //Search button
    searchButton.addEventListener('click', () =>{
      const searchTerm = document.getElementById('searchInput').value;
      fetchQueryData(searchTerm);
    });

    //Progress filter button
    filterProgressButton.addEventListener('click', () =>{
      const filterTerm = document.getElementById('filterProgress').value;
      fetchQueryData(filterTerm);
    })


    //General purpose helper function for queries
    const fetchQueryData = async (queryTerm) => {
      const progressChoices = ["Not Started", "In Progress", "Completed"];
    
      let serverUrl, serverUrlQuery;
    
      if (progressChoices.includes(queryTerm)) {
        serverUrl = 'http://localhost:3000/documents/searchProgress';
        serverUrlQuery = `${serverUrl}?progress=${queryTerm}`;
      } else {
        serverUrl = 'http://localhost:3000/documents/search';
        serverUrlQuery = `${serverUrl}?title=${queryTerm}`;
      }
    
      try {
        const response = await fetch(serverUrlQuery);
    
        if (!response.ok) {
          throw new Error('No network response');
        }
    
        const documentData = await response.json();
        console.log('Fetched document data:', documentData);
        displayAllDocuments(documentData);
      } catch (error) {
        console.log(`Error processing response: ${error.message}`);
      }
    };

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

          const cellYear = newRow.insertCell(2);
          cellYear.textContent = doc.year;

          const cellLink = newRow.insertCell(3);
          cellLink.textContent = doc.link;

          const cellJournal = newRow.insertCell(4);
          cellJournal.textContent = doc.journal;

          const cellVolume = newRow.insertCell(5);
          cellVolume.textContent = doc.volume;

          const cellPage = newRow.insertCell(6);
          cellPage.textContent = doc.page;

          const cellProgress = newRow.insertCell(7);
          cellProgress.textContent = doc.progress;
          cellProgress.classList.add(progressClassName);

          const cellActions = newRow.insertCell(8);

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
          cellDeleteButton.addEventListener('click', (event) =>{  //!!! TODO CREATE HELPERS
            deleteData(event);
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

    //ASYNC delete data function
    const deleteData = async (event) =>{
      try{
        const rowIndex = event.target.closest('tr').rowIndex;
        const documentIndex = rowIndex - 1;
        const retrievedDocuments = await fetchDocumentHelper();

        if (!Array.isArray(retrievedDocuments)) {
          throw new Error('Invalid data retrieved from the server');
        }

        const deleteTargetDocument = retrievedDocuments[documentIndex];

        const documentsAfterDelete = await deleteDocument(deleteTargetDocument.title);
        displayAllDocuments(documentsAfterDelete);

      } catch (error){
        console.error('error in deleteData function:', error.message);
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

        const newAuthor = prompt('Enter new author:', editTargetDocument.author);
        const newYear = prompt('Enter new year:', editTargetDocument.year);
        const newLink = prompt('Enter new link:', editTargetDocument.link);
        const newJournal = prompt('Enter new journal:', editTargetDocument.journal);
        const newVolume = prompt('Enter new volume:', editTargetDocument.volume);
        const newPage = prompt('Enter new page range:', editTargetDocument.page);
        const newProgress = prompt('Enter new progress: Choose Not Started, In Progress, or Completed', editTargetDocument.progress);

        const updatedDocument ={
          title: editTargetDocument.title,
          author: newAuthor,
          year: newYear,
          link: newLink,
          journal: newJournal,
          volume: newVolume,
          page: newPage,
          progress: newProgress
        };

        const updateResponse = await updateDocument(editTargetDocument.title, updatedDocument);
        displayAllDocuments(updateResponse);

      } catch (error) {
        console.error('Error in editData function:', error.message);
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

    //DELETE request helper, delete the data in the server and returns updated list
    const deleteDocument = async (targetDocumentTitle) =>{
      const deleteRoute = `http://localhost:3000/documents/${targetDocumentTitle}`;
      try{
        const response = await fetch (deleteRoute, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok){
          throw new Error ('Failed to delete document');
        }
        return response.json();
      } catch (error){
        console.error('Error deleting document:', error.message);
      }
    }

    //PUT request helper, edits the data in the server and returns updated list
    const updateDocument = async (targetDocumentTitle, updatedDocument) =>{
      const updateRoute = `http://localhost:3000/documents/${targetDocumentTitle}`;
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


  