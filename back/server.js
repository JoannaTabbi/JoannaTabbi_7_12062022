const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();
const router = require('./app/routes/index.routes');
const path = require('path');

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
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur le réseau social groupomania" });
});
app.use('/api', router);
//app.use("/uploads/profile", express.static(path.join(__dirname, "avatar")));
//app.use("/uploads/postPhoto", express.static(path.join(__dirname, "postPhoto")));
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});