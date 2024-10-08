let currentPage = 1;
const resultsPerPage = 20;  // Number of results per page
const nFrag = 5;  // Number of fragment snippets to return
const lFrag = 100;  // Length of each fragment
const corsProxy = 'https://cors-anywhere.herokuapp.com/';

document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const query = document.getElementById('searchQuery').value;
    currentPage = 1;
    search(query, currentPage);
});

async function search(query, page) {
    const startHit = (page - 1) * resultsPerPage;
    const endHit = startHit + resultsPerPage;

    const BCLawsApiUrl = `http://www.bclaws.ca/civix/search/complete/fullsearch?q=${query}&s=${startHit}&e=${endHit}&nFrag=${nFrag}&lFrag=${lFrag}`;
    try{
     const response = await axios.get(corsProxy + BCLawsApiUrl);
     const parser = new DOMParser();
     const xmlDoc = parser.parseFromString(response.data, "application/xml");
     displayResults(xmlDoc);  
    }
    catch (error) {
        console.error('Error fetching BC Laws data:', error);
        alert('Error fetching BC Laws data. Check if you need to enable CORS https://cors-anywhere.herokuapp.com/corsdemo ');
    }
}

function displayResults(xmlDoc) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';  // Clear previous results
    const results = xmlDoc.querySelector('results');
    const docs = xmlDoc.getElementsByTagName('doc');
    if (docs.length === 0) {
        resultsDiv.innerHTML = "<p class = 'd-flex justify-content-center text-danger'>No results found.</p>";
        return;
    }

    const resultList = document.createElement('div');
    resultList.className = 'list-group';
    for (let i = 0; i < docs.length; i++) {
        const doc = docs[i];
        const title = doc.querySelector('CIVIX_DOCUMENT_TITLE').textContent;
        const docId = doc.querySelector('CIVIX_DOCUMENT_ID').textContent;
        const fragment = doc.querySelector('frag').textContent;

       const listItem = document.createElement('a');
        listItem.href = '#';  // You can replace this with a real URL
        listItem.className = 'list-group-item list-group-item-action';
        listItem.innerHTML = `
            <h5 class="mb-1">${title}</h5>
            <p class="mb-1">${fragment}</p>
            <button class="btn btn-secondary btn-sm" onclick="summarizeDocument('${docId}')">Summarize</button>
            <div class="summary mt-2" id="summary-${i}"></div>`;
        resultList.appendChild(listItem);
    }

    resultsDiv.appendChild(resultList);
    const totalResults = parseInt(results.getAttribute('totalhits'));
    displayPagination(totalResults);
}

function displayPagination(totalResults) {
    
 const paginationDiv = document.getElementById('pagination');
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    if (totalPages <= 1) return;  // No need for pagination if only one page

   if (currentPage > 1) {
        const prevButton = createPaginationButton('Previous', currentPage - 1);
        paginationDiv.appendChild(prevButton);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = createPaginationButton(i, i);
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        paginationDiv.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = createPaginationButton('Next', currentPage + 1);
        paginationDiv.appendChild(nextButton);
    }
}

function createPaginationButton(text, page) {
    const li = document.createElement('li');
    li.className = 'page-item';
    
    const button = document.createElement('button');
    button.className = 'page-link';
    button.textContent = text;
    button.onclick = () => changePage(page);
    
    li.appendChild(button);
    return li;
}

function changePage(page) {
    const query = document.getElementById('searchQuery').value;
    currentPage = page;
    search(query, currentPage);
}


async function summarizeDocument(documentId) {
    const openApiKey = prompt("Please enter your OpenAI API key:");
    
    // If no key is provided, exit the function
    if (!openApiKey) {
        alert("Summarization cannot proceed without an OpenAI API key. Please provide a valid key to continue.");
        return;
    }
     try {
        // Fetch document content from BC Laws
        const documentUrl = `https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/${documentId}/xml`;
        const response = await axios.get(corsProxy + documentUrl);        
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, 'text/html');

        // Extract relevant content (e.g., main content of the document)
        //const mainContent = doc.querySelector('body').textContent.trim();
        const parsedXml =  parser.parseFromString(response.data, "application/xml");
        const actContent = parsedXml.querySelector('act\\:act');
         if (!actContent) {
            throw new Error("The act content was not found in the XML.");
        }
        const plainTextContent = extractRelevantTextFromAct(actContent);
        // Convert XML content to plain text (depending on your needs)
        //const plainText = extractPlainTextFromXmlContent(mainContent); 
        // Summarize the document using OpenAI              
        const openAiApiUrl = 'https://api.openai.com/v1/completions';
        const aiResponse = await axios.post(corsProxy + openAiApiUrl, {
            model: "gpt-3.5-turbo",
            prompt: `Summarize the following legal document in one short paragraph:\n\n${plainText}`,
            max_tokens: 10,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openApiKey}` 
            }
        });
        alert(`Summary successfully retrieved: ${summary}`);
    }
    catch (error) {
        alert('Error summarizing the document', error);     
    }    
}

function extractRelevantTextFromAct(actContent) {
    // Assuming we need to extract certain child elements like <act:title>, <act:chapter>, etc.
    const title = actContent.querySelector('act\\:title') ? actContent.querySelector('act\\:title').textContent : 'No title';
    const chapter = actContent.querySelector('act\\:chapter') ? actContent.querySelector('act\\:chapter').textContent : 'No chapter';
    const sections = actContent.querySelectorAll('bcl\\:section');

    let sectionsText = '';
    sections.forEach(section => {
        const sectionNumber = section.querySelector('bcl\\:num') ? section.querySelector('bcl\\:num').textContent : '';
        const sectionText = section.querySelector('bcl\\:text') ? section.querySelector('bcl\\:text').textContent : '';
        sectionsText += `Section ${sectionNumber}: ${sectionText}\n`;
    });

    // Return a clean text content to send to OpenAI
    return `Title: ${title}\nChapter: ${chapter}\n${sectionsText}`;
}


function extractPlainTextFromXmlContent(Content) {  
    return JSON.stringify(Content);
}
