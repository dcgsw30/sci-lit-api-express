document.addEventListener('DOMContentLoaded', function () {

    const generateCitationButton = document.getElementById('citationButton'); 

    generateCitationButton.addEventListener('click', () => {

        const literatureTbody = document.getElementById('literatureListContainer');
        const rows = literatureTbody.getElementsByTagName('tr'); 
        const citationListBody = document.getElementById('citationListContainer');


        for (let i = 0; i < rows.length; i++) {
            const dataCells = rows[i].getElementsByTagName('td');

            const title = dataCells[0].innerText;
            const author = dataCells[1].innerText;
            const year = dataCells[2].innerText;
            const doi = dataCells[3].innerText;
            const journal = dataCells[4].innerText;
            const page = dataCells[5].innerText;
            
            const citation = `${author}.${year}.${title}. ${journal}, ${page}. ${doi}.`
            const newRow = citationListBody.insertRow();
            newRow.textContent = citation;
        }

    });
});


