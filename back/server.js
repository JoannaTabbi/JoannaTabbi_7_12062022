const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();
const router = require('./app/routes/index.routes');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const speedLimiter = require('./app/middleware/speed-limiter');
const helmet = require('helmet');
const hateoasLinker = require('express-hateoas-links');

const db = require('./app/config/db.config');
// setting headers for CORS errors
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// replace standard express res.json with the new version (second param possible)
app.use(hateoasLinker);
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur le réseau social groupomania" });
});
app.use('/api', router);
// set path to images
app.use("/images", express.static(path.join(__dirname, "images")));

/**
 * searche for the keys beginning with $ or containing . characters and removes 
 * these caracters from user-supplied input in the following places:
 - req.body
 - req.params
 - req.headers
 - req.query
 */
 app.use(mongoSanitize());

 //apply speed limiter to all requests
 app.use(speedLimiter);
 
 /**
  * set various HTTP headers to secure the app ; see https://helmetjs.github.io/ 
  * for more details
  */ 
 app.use(helmet());
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});