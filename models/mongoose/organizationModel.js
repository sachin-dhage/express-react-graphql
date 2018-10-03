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
const OrganizationSchema = new Schema({
    client  :   { type : String, required : true, max : 10},
    lang    :   { type : String, required : true, max : 10},
    organizationid     :   { type: String, max : 100},
    name        :   { type: String, max : 100},
    tanno       :   { type: String, max : 100},
    panno       :   { type: String, max : 100},
    gstno       :   { type: String, max : 100},
    country     :   { type: String, max : 100},
    website     :   { type: String, max : 100},
    hrheadfirstname    :   { type: String, max : 100},
    hrheadlastname     :   { type: String, max : 100},
    hrheademployeeid   :   { type: String, max : 100},
    hrheademailid      :   { type: String, max : 100},
    alternatecontactfirstname    :   { type: String, max : 100},
    alternatecontactlastname     :   { type: String, max : 100},
    alternatecontactemployeeid   :   { type: String, max : 100},
    alternatecontactemailid      :   { type: String, max : 100},
    ceofirstname    :   { type: String, max : 100},
    ceolastname     :   { type: String, max : 100},
    ceoemployeeid   :   { type: String, max : 100},
    ceoemailid      :   { type: String, max : 100},
    cfofirstname    :   { type: String, max : 100},
    cfolastname     :   { type: String, max : 100},
    cfoemployeeid   :   { type: String, max : 100},
    cfoemailid      :   { type: String, max : 100},
    noofemployees    :   { type: String, max : 100},
    employeeturnover :   { type: String, max : 100},
    technology       :   { type: String, max : 500},
    status       :   { type: String, max : 100},
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
OrganizationSchema.methods.AddCreateParams = () =>
{
    this.cdate = sysdate_yyyymmdd;
    this.ctime = systime_hh24mmss;
    this.isdel = false;
}

// Export model
const organization = mongoose.model('Organizations', OrganizationSchema, 'Organizations');
module.exports = organization;
