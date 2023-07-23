const app = require('./app.js');

// Db connection
const { mongoose } = require('./database'); 

// Settings 
app.set('port', process.env.PORT || 3000); 

// Starting the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`); 
});
