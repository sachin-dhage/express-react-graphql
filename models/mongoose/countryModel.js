//Import the mongoose module
import mongoose from 'mongoose';

// Get Schema instance
const Schema = mongoose.Schema;

// Define the schema
const CountrySchema = new Schema({
    client  :   { type : String, required : true, max : 10},
    lang    :   { type : String, required : true, max : 10},
    code    :   { type: String, max : 100},
    desc       :   { type: String, max : 500}
});


// Export model
const country = mongoose.model('Country', CountrySchema, 'Country');
module.exports = country;
