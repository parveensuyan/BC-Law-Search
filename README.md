# BC-Law-Search
Ability to search BC Provincial legislation documents and related policy and legislative materials by both topic and jurisdiction using BC LAW API. Please click here for the hosted github page (https://parveensuyan.github.io/BC-Law-Search/). 

In case of issues facing retrive data from BC Law API make sure https://cors-anywhere.herokuapp.com/ and click the button there to enable cross. 

**List of design assumptions**
1.	**API Accessibility**: The BC Laws API is publicly accessible, supports cross-origin requests (CORS), and the endpoints needed for both searching and retrieving documents are fully functional and stable. Enable CORS by going to this website (https://cors-anywhere.herokuapp.com/corsdemo).
2.	**Search Criteria**: The search functionality will allow keyword-based searches within legislative documents, assuming the BC Laws API provides relevant results.
3.	**Document Format**: The API provides documents in a structured format (XML or HTML) that includes meaningful content such as legislation titles, sections, and definitions, which can be extracted for summarization.
4.	**Namespace Handling**: The XML responses include namespaces, and the DOMParser or equivalent parsing tools can handle these namespaces without conflicts in querying.
5.	**OpenAI Integration**: Need to provide openAPI key for summarization purpose. OpenAI's API is available and accessible with proper authentication, and it can process the text extracted from the documents without limitations on size, format, or legal content.
6.	**Client-Side Execution**: All operations, including fetching documents and interacting with OpenAI, occur on the client side using JavaScript and modern browser APIs without requiring a dedicated server-side backend.
7.	**Content Structure**: The content structure of the documents is consistent across all retrieved documents, allowing the same parsing logic to work for different legislative documents.
8.	**No Authentication**: There is no user authentication in this version; all users can perform searches and view summaries.

**A test plan for the app**
1. **Functional Testing**:
o	**Search Functionality**: Test that the search input correctly queries the BC Laws API with different keywords and retrieves relevant legislation documents.
o	**Pagination**: Verify that pagination works as expected, allowing navigation through multiple pages of search results.
o	**Document Retrieval**: Ensure that clicking on a document title successfully retrieves the document's content (in XML or HTML format).
o	**Summarization**: Test that the “Summarize” button triggers a request to the OpenAI API and displays the summarized content correctly for different types of documents.
2.	**Error Handling**:
o	**API Errors**: Simulate network issues or API unavailability (e.g., wrong API keys or quota limits) and verify that the app displays appropriate error messages to the user without crashing.
o	**CORS Issues**: Test if the app handles cross-origin resource sharing (CORS) issues effectively, using a proxy or alternative methods.
o	**Empty Search Results**: Test edge cases where no results are returned for a query and ensure the app gracefully handles and informs the user.
3.	**Performance Testing**:
o	Verify the time taken to retrieve and summarize documents, ensuring the app does not time out.
4.	**Cross-Browser Testing**:
o	Test the app across major browsers (Chrome, Firefox, Safari, Edge) to ensure consistent behavior.

**How we can migrate it to a major cloud services provider**
1.	**Containerization**: Use Docker to containerize the app, ensuring it runs consistently across environments.
2.	**Hosting**: Migrate the app to cloud platforms such as AWS (using S3), Azure (using Azure Static Web Apps), or Google Cloud (using Firebase Hosting).
3.	**Backend Integration**: If required in production, add a lightweight backend (using AWS Lambda or Azure Functions) to handle server-side API interactions and provide better security (e.g., hiding API keys).
4.	**CI/CD Setup**: Integrate GitHub Actions to automate the deployment to cloud services on every push to the repository.

**What the deployment pipeline will look like** 
1.	**Source Control**: All code is stored in a GitHub repository.
2.	**Continuous Integration**: GitHub Actions run tests on each commit, ensuring no breaking changes.
3.	**Build Process**: For production, assets are minified, and files are optimized for faster loading times.
4.	**Continuous Deployment**: Once tests pass, GitHub Actions automatically deploy the app to GitHub Pages (for PoC) or a cloud service such as AWS or Azure (for production).
5.	**Monitoring**: Basic logging and monitoring can be added in the cloud environment to track API performance, error rates, and user interaction metrics.

**What the deployment pipeline will look like**
1.	**Source Control**: All code is stored in a GitHub repository.
2.	**Continuous Integration**: GitHub Actions run tests on each commit, ensuring no breaking changes.
3.	**Build Process**: For production, assets are minified, and files are optimized for faster loading times.
4.	**Continuous Deployment**: Once tests pass, GitHub Actions automatically deploy the app to GitHub Pages (for PoC) or a cloud service such as AWS or Azure (for production).
5.	**Monitoring**: Basic logging and monitoring can be added in the cloud environment to track API performance, error rates, and user interaction metrics.

**Software stack recommendations and feature improvements you can think of for the prod version**
1.	**Frontend**: ReactJS for scalability
2.	**Backend**: Use Node.js with Express for handling API requests securely.
3.	**CI/CD pipelines**: Implement CI/CD pipelines (e.g., GitHub Actions) for automated deployments
4.	**Caching**: Implement caching mechanisms (e.g., AWS CloudFront or browser caching) to store frequently queried documents and improve performance.
5. **User Authentication**: Add OAuth-based user authentication for tracking users and securing access to the application.
6.	**Enhanced UX**: Allow users to search by specific legislation categories, dates, or document types for more targeted results.
   
**how you’d like to demo the app for the working group**.
1.	**Search Functionality**: Demonstrate how users can input keywords to search for BC legislation.
2.	**Document Retrieval**: Show how a specific document is retrieved from the BC Laws API, displaying its structured content.
3.	**Summarization Feature**: Highlight the integration with OpenAI to summarize the retrieved document into a short paragraph.
4.	**Pagination**: Demonstrate how users can navigate through multiple search results using pagination.
5.	**Error Handling**: Showcase how the app gracefully handles errors, such as failed API requests or empty search results.


