//Import the mongoose module
import mongoose from 'mongoose';

// Get Schema instance
const Schema = mongoose.Schema;

// Define the schema
const CVUnknownCategorySchema = new Schema({
    client  :   { type : String, required : true, max : 10},
    lang    :   { type : String, required : true, max : 10},
    attribute : { type: String, max : 100},
    cdate : { type : String, max : 48},
    ctime : { type : String, max : 48},
    cuser : { type : String, max : 48},
    udate : { type : String, max : 48},
    utime : { type : String, max : 48},
    ucuser : { type : String, max : 48},
    isdel : { type : Boolean, required : true},
    ddate : { type : String, max : 48},
    dtime : { type : String, max : 48},
    duser : { type : String, max : 48}        
});


// Export model
const cvunknowncat = mongoose.model('CVUnknownCategory', CVUnknownCategorySchema, 'CVUnknownCategory');
module.exports = cvunknowncat;
