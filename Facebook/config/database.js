const connection = require('mongoose').connect('mongodb://localhost/database', {
  useMongoClient: true
}, (err) => {
  if (err) {
    console.log(err, 'Error in database connection');
  }
});

module.exports = connection;
