# Getting Started

The foam classification application displays all the bioreactor images as well as radio buttons to classify/reclassify the image as foaming or not foaming.  You may filter the images displayed by 'all', 'foaming', 'not foaming' and 'unclassified'.  You may also change the number of images displayed on the page by 20, 50 and 100.

## Seeding the Database

I chose to use PostgreSQL for the database.  After pulling code, create a database either by the name of 'foamdb' or a name of your choice.  If you choose your own name, navigate to the db.js file in the backend folder and change the alternate name on line 7.  You also have the option of saving your name as an environmental variable.

To seed the JSON data into the database, I created an easy to use script you can run in the command line.  Navigate to the backend folder and run the command 'npm run db:seed'. This will run the db_seed.js file in the backend, calling the given url using axios, then creating the images table and looping through the JSON data to insert the rows (url and last_modified).  Table, by default, serializes an id for each image and inserts an is_foaming and is_classified attribute, both set to 'false'.

## Installing Dependencies/Starting App

Dependencies can be found in the package.json files in the respective front and back end folders.  The backend is built with Express and Node, utilizing the libraries 'pg' and 'axios'.  The frontend is built with React.  Run 'npm install' to install dependencies in both the front and back end folders.  Once complete, you can run the command 'npm start' in both folders to start server on the backend and launch the client-side in the browser.

## Demo Video

A screen recording of the look and function of the application can be found here: https://youtu.be/KG-92-TJvik.

## Notes

I noticed that the URL where the JSON is found expires, so when I went to seed the database, I would get a 403 error.  In order to fix this, I had to refresh the URL in the browser and recopy and paste it into the db_seed.js file before I seeded the database.

## Design/Features

As far as design, the application is fairly straight forward. There is an ImageList and ImageCard component on the frontend.  The ImageList maps over the images object passed into it as a prop by the App.js component, and renders an ImageCard for each image.  The ImageList is rendered in the App.js component.  On the backend, there is a routes and models file for images, as well as a db, config and seed script files.  

The bulk of the functionality is housed in the App component, including handling the changing filters and clicking on the pagination.  At initial mounting of the App.js component, in its useEffect, the getImages function is called.  This function calls the backend route GET /images and, by default loads all images, including those classified as foaming, not foaming and unclassified.  

Initially, when JSON is seeded into the database, all images are marked as unclassified and is_foaming is set to false.  Rendered on the page inside the ImageCard is the text 'Image needs classification' in red.  Once you click on the image card to classify it as either foaming or not foaming, the backend PATCH /images route is called and image attribute is_foaming is updated in the database as well as the is_classified attribute set to 'true' and last_modified is updated with new Timestamp.  The image is then updated on the page and red text alerting client image needs classification disappears.   


