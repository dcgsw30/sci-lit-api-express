document.addEventListener('DOMContentLoaded', function () {

    const generateCitationButton = document.getElementById('citationButton'); 

    generateCitationButton.addEventListener('click', () => {

        const literatureTbody = document.getElementById('literatureListContainer');
        const rows = literatureTbody.getElementsByTagName('tr'); 
        const citationListBody = document.getElementById('citationListContainer');
        const citationOption = document.getElementById('citationStyle').value;

        citationListBody.innerHTML = '';

        for (let i = 0; i < rows.length; i++) {
            const dataCells = rows[i].getElementsByTagName('td');

            const title = dataCells[0].innerText;
            const author = dataCells[1].innerText;
            const year = dataCells[2].innerText;
            const doi = dataCells[3].innerText;
            const journal = dataCells[4].innerText;
            const volume = dataCells[5].innerText;
            const page = dataCells[6].innerText;

            let citation;

            if (citationOption == 'apa'){
                citation = `${author}. (${year}). ${title}. ${journal}, ${volume}, ${page}. ${doi}.`;
            } else if (citationOption == 'mla'){
                citation = `${author}. "${title}." ${journal}, vol.${volume}, ${year}, pp. ${page}. ${doi}`;
            } else {
                console.log("no options selected");
            }
            
            const newRow = citationListBody.insertRow();
            const newCell = newRow.insertCell(0);
            newCell.textContent = citation;
        }

    });
});


