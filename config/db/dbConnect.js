//Import the mongoose module
var mongoose = require('mongoose');


    //Set up default mongoose connection
    var mongoDB_URI = 'mongodb://algorithmus:algorithmus1234@ds259742.mlab.com:59742/algorithmus';           // Remote host
    //var mongoDB_URI = 'mongodb://localhost/algorithmus';           // Local host

    //var mongoDB_URI = 'mongodb://192.168.1.100/itss';         // Remote host
    //var mongoDB_URI = 'mongodb://itss:itss@ds159489.mlab.com:59489/itss';           // Remote host
    //var mongoDB_URI = 'mongodb+srv://itss:itss1234@cluster0-4uuqd.mongodb.net/test';           // New host
    //var mongoDB_URI = 'mongodb://localhost/itss';           // Local host

    // Connect to database
    mongoose.connect(mongoDB_URI);

    // Use global promise
    mongoose.Promise = global.Promise;

    // Get the default connection
    var dbConnection = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    dbConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));

    console.log('Connetced to ' + mongoDB_URI);


// Export db connection
module.exports = dbConnection;