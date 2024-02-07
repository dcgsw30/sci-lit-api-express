document.addEventListener('DOMContentLoaded', function () {

    const generateCitationButton = document.getElementById('citationButton'); 

    generateCitationButton.addEventListener('click', () => {

        var literatureTbody = document.getElementById('literatureListContainer');
        var rows = literatureTbody.getElementsByTagName('tr'); 

        for (let i = 0; i < rows.length; i++) {
            const dataCells = rows[i].getElementsByTagName('td');

            const title = dataCells[0].innerText;
            const author = dataCells[1].innerText;
            const doi = dataCells[2].innerText;
            const journal = dataCells[3].innerText;
            const page = dataCells[4].innerText;
            
            const citation = `${author}. ${title}. ${journal}, ${page}. ${doi}.`
            console.log(citation)
        }

    });
});


