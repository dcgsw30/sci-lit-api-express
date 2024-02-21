# Sci-Lit Citation Application

Welcome to my first full-stack personal project, Sci-Lit! Before switching into the field of Computer Science, I completed a Bachelor of Science in Biology where I did lots of research projects and papers. While working on my undergraduate thesis, I realized how difficult it was to manage all my citations and use different citation plugins such as Zotero. I created this application to support myself and other life-science academics sort different scientific literature and keep track of reading progress for each paper! In this project, I used self-learned languages and tools such as HTML and CSS to design the website, Javascript to enable user interactions, and Express for the back end.

## Project Demo

The Sci-Lit application has all four basic CRUD operations to create, add, update, and delete literature data in the server. Let's say the user is reading a paper and wants to add it to the reading collection. The user can simply type all the details of that paper inside one of the action boxes. 

![Action Box](/public/styles/images/action-boxes.png)

Once the user clicks on the "Add Document" button, the application sends a POST request to the server, and immediately chains that request with a GET request to retrieve all stored documents. All documents and their corresponding information will be displayed in the retrieved documents table, including the one we just added! If the user scrolls to the right of the table, there will be 2 red "edit" and "delete" buttons that modifies and deletes literature in the server too.

![Literature List](/public/styles/images/lit-list.png)

With the completed list, the user can generate the citations of each paper stored in the list. At this moment, Sci-Lit supports APA and MLA citation styles due to their popularity in academia. 

![Citation List](/public/styles/images/citation-list.png)

## Learning Experience

From completing this project, I learned how to:
- Apply acquired knowledge from Codecademy into practical applications 
- Design a HTML DOM from scratch to improve visual aesthetics and user interactions
- Use API calls to bridge the client to the server
- Set up a functional Express server that listens and responds to incoming client-side HTTP requests 
- Refactor code to adhere to DRY (Don't Repeat Yourself) approaches
