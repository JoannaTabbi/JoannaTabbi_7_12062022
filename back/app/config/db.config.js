const mongoose = require('mongoose');
require('dotenv').config();
const bunyan = require('bunyan');

if (!process.env.MONGO_URI) {
  console.log("No DB_URL found in .env configuration");
}

/**
 * create bunyan logger 
 */

const log = bunyan.createLogger({
  name: "MongoDB Driver",
  serializers: {
    dbQuery: serializer,
  },
  streams: [{
      stream: process.stdout,
      level: "info",
    },
    {
      stream: process.stdout,
      level: "debug",
    },
    {
      stream: process.stderr,
      level: "error",
    },
    {
      type: "rotating-file",
      path: "./logs/mongodb.log", // logs will be printed in mongodb.log file
      period: "1d", // daily rotation
      count: 3, // keep 3 back copies
    },
  ],
});

function serializer(data) {
  let query = JSON.stringify(data.query);
  let options = JSON.stringify(data.options || {});

  return `db.${data.coll}.${data.method}(${query}, ${options});`;
}

// set the debug option 
mongoose.set("debug", function (coll, method, query, doc, options) {
  let set = {
    coll: coll,
    method: method,
    query: query,
    doc: doc,
    options: options
  };

  log.info({
    dbQuery: set
  });
});


/**
 * establishes the connexion to the database MongoDB through mongoose module
 */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch(error => {
    console.log("Database connection error: " + error);
  });

module.exports = mongoose.connection;