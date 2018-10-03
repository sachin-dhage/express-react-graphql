//Import the mongoose module
import mongoose from 'mongoose';

//Import the date format module
import dateFormat from 'dateformat';

// Get current date and time
const now = new Date();
const sysdate_yyyymmdd = dateFormat(now,'yyyymmdd');
const systime_hh24mmss = dateFormat(now,'HHMMss');

// Get Schema instance
const Schema = mongoose.Schema;

// Define the schema
const CandidateSchema = new Schema({
    client  :   { type : String, required : true, max : 10},
    lang    :   { type : String, required : true, max : 10},
    candidateid     :   { type: String, max : 100},
    firstname     :   { type: String, max : 100},
    middlename     :   { type: String, max : 100},
    lastname     :   { type: String, max : 100},
    emailid     :   { type: String, max : 100},
    password     :   { type: String, max : 100},
    mobileno     :   { type: String, max : 10},
    idprooftype     :   { type: String, max : 50},
    idproofno     :   { type: String, max : 50},
    experience     :   { type: String, max : 10},
    country     :   { type: String, max : 50},
    technology     :   { type: String, max : 1000},
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


// Custom methods for schema
// Add Create Params
CandidateSchema.methods.AddCreateParams = () =>
{
    this.cdate = sysdate_yyyymmdd;
    this.ctime = systime_hh24mmss;
    this.isdel = false;
}

// Export model
const candidate = mongoose.model('Candidates', CandidateSchema, 'Candidates');
module.exports = candidate;
