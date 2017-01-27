api.js     database.js
    \         /
     \       /
      main.js
         |
     index.html


Single responsibility principle.
api.js handles all communications with the api, always returns a Javascript object.
database.js handles all communication with the database via firebase. 
index.html consists of containers that can be filled with content via main.js. No javascript.
main.js is the spider. It creates references to the containers in index.html and makes all calls to api.js and database.js to fill these containers with the relevant data.

Deploy locally on localhost:5000 by writing firebase serve