// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const tediousExpress = require('express4-tedious');

const oauthserver = require('oauth2-server');
const swaggerJSDoc = require('swagger-jsdoc');
const mongoose = require('mongoose');
const postsApi = require('./routes/posts-api');
const usersApi = require('./routes/users-api');
const entityApi = require('./routes/entity-api');
// swagger Definition
const swaggerDefinition = {
    info: {
        title: 'Node Swagger API',
        version: '1.0.0',
        description: 'RESTful API ',
    },
    host: 'localhost:3000',
    basePath: '/',
};

// options for the swagger docs
const options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./server.js', './routes/*.js'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);
// Get our API routes


const app = express();

// Parsers for POST data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// app.use(function(req, res, next) {
//     //Enabling CORS 
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
//     next();
// });

// Point static path to dist
app.use(express.static(path.join(__dirname, 'public')));


app.oauth = oauthserver({
    model: require('./models/oatuh-model'), // See below for specification 
    grants: ['password'],
    debug: true
});


// Set our api routes
app.use('/api', [postsApi, usersApi, entityApi]);

// Catch all other routes and return the index file
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// });
app.all('/oauth/token', app.oauth.grant());

app.get('/', app.oauth.authorise(), function(req, res) {
    res.send('Secret area');
});

app.use(app.oauth.errorHandler());

app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on :${port}`));