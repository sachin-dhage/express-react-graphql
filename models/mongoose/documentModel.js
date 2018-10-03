//Import the mongoose module
import mongoose from 'mongoose';

//Import the date format module
import dateFormat from 'dateformat';

const now = new Date();
const sysdate_yyyymmdd = dateFormat(now,'yyyymmdd');
const systime_hh24mmss = dateFormat(now,'HHMMss');

// Get Schema instance
const Schema = mongoose.Schema;

// Define the schema
const DocumentSchema = new Schema(
    {
        client  :   { type : String, required : true, max : 10},
        lang    :   { type : String, required : true, max : 10},

        candidateid     :   { type: String, max : 100},
        documentid      :   { type: String, max : 100},
        documentname    :   { type: String, max : 100},
        documenttype    :   { type: String, max : 100 },
        documentsize    :   { type: String, max : 100 },
        document        :   { type: Buffer },

        cdate : { type : String, max : 48},
        ctime : { type : String, max : 48},
        cuser : { type : String, max : 48},
        udate : { type : String, max : 48},
        utime : { type : String, max : 48},
        ucuser : { type : String, max : 48},
        isdel : { type : Boolean , required : true},
        ddate : { type : String, max : 48},
        dtime : { type : String, max : 48},
        duser : { type : String, max : 48}
    }
);


// Custom methods for schema
// Add Create Params
DocumentSchema.methods.AddCreateParams = function()
{
    this.cdate = sysdate_yyyymmdd;
    this.ctime = systime_hh24mmss;
    this.isdel = false;
}


// Export model
const document = mongoose.model('Documents', DocumentSchema, 'Documents');
module.exports = document;