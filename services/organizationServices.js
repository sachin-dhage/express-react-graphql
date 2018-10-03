// import section
import connection from "../config/db/dbConnect";
import {organizationModel} from "../models/mongoose";
import math from 'mathjs';
import validations from '../common/validations';

//Import the date format module
import dateFormat from 'dateformat';
var now = new Date();
var sysdate_yyyymmdd = dateFormat(now,'yyyymmdd');
var systime_hh24mmss = dateFormat(now,'HHMMss');


// Resolver function for query searchOrganizations({input}) : [Organization]
const searchOrganizations = async (args, context, info) =>
{
    let exactMatch = args.exactMatch;
    let conditions;


    if(exactMatch)
    {
        conditions = {
            client : ((typeof args.client !== 'undefined' && args.client.trim() ) ? args.client.trim() : new RegExp(args.client,'i') ),
            lang : ((typeof args.lang !== 'undefined' && args.lang.trim() ) ? args.lang.trim() : new RegExp(args.lang,'i') ),
            organizationid : ((typeof args.organizationid !== 'undefined' && args.organizationid.trim() ) ? args.organizationid.trim() : new RegExp(args.organizationid,'i') ),
            name : ((typeof args.name !== 'undefined' && args.name.trim() ) ? args.name.trim() : new RegExp(args.name,'i') ),
            country : ((typeof args.country !== 'undefined' && args.country.trim() ) ? args.country.trim() : new RegExp(args.country,'i') ),
            technology : ((typeof args.technology !== 'undefined' && args.technology.trim() ) ? args.technology.trim() : new RegExp(args.technology,'i') ),
            isdel : false
        };

    }
    else
    {
        conditions = {
            client : ((typeof args.client !== 'undefined' && args.client.trim() ) ? args.client.trim() : new RegExp(args.client,'i') ),
            lang : ((typeof args.lang !== 'undefined' && args.lang.trim() ) ? args.lang.trim() : new RegExp(args.lang,'i') ),
            organizationid : new RegExp(( typeof args.organizationid !== 'undefined' ? args.organizationid.trim() : args.organizationid),'i'),
            name : new RegExp(( typeof args.name !== 'undefined' ? args.name.trim() : args.name),'i'),
            country : ((typeof args.country !== 'undefined' && args.country.trim() ) ? args.country.trim() : new RegExp(args.country,'i') ),
            technology : new RegExp(( typeof args.technology !== 'undefined' ? args.technology.trim() : args.technology),'i'),
            isdel : false
        };
    }

    /*console.log("\nconditions => ");
    console.log(conditions);  */

    return organizationModel.find(conditions);

}



/**
 * CRUD Operations for Organizations
 **/
// Resolver function for mutation OrganizationsCRUDOps(input) : String
const OrganizationsCRUDOps = async (args, context, info) =>
{
    try 
    {                        
        // Get the transaction from arguments
        let transaction = args.transaction;

        let affectedRecords = 0;

        // If transaction is not available
        if(typeof transaction === 'undefined' || transaction.trim().length == 0)
            throw new Error("Transaction is required and can not be empty.");

        transaction = transaction.trim().toUpperCase();    
        
        if(transaction == "CREATE")     // Create 
        {

            // Validate input data
            let organizations = await validateCREATEData(args.organizations);

            affectedRecords = await createOrganizations(organizations);

            /*//Check uniqueness of input data
            let duplicateObj =  await checkDuplicateOrganizations(organizations);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createOrganizations(organizations);
            }*/

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let organizations = await validateUPDATEData(args.organizations);

            // Update Organization data
            affectedRecords = await updateOrganizations(organizations);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateOrganizations(organizations);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != organizations.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateOrganizations(organizations);
            }*/

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let organizations = await validateDELETEData(args.organizations);

            // Logical delete Organization data
            affectedRecords = await logicalDeleteOrganizations(organizations);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateOrganizations(organizations);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != organizations.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteOrganizations(organizations);
            }*/

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let organizations = await validateDELETEData(args.organizations);

            // Physical delete Organization data
            affectedRecords = await physicalDeleteOrganizations(organizations);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateOrganizations(organizations);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != organizations.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteOrganizations(organizations);
            }*/

        }
        else    // Throw invalid transaction error
        {
            throw new Error("Invalid transaction specified.");
        }

        return affectedRecords;        

    } 
    catch (error) 
    {
        return error;    
    }

}


// Validation funtion for creation
const validateCREATEData = async (organizations) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < organizations.length; i++)
        {
            let validationObject = {};

            validations.checkNull("client", organizations[i].client, "Client is required", validationObject);
            validations.checkNull("lang", organizations[i].lang, "Language is required", validationObject);
            validations.checkNull("name", organizations[i].name, "Organization name is required", validationObject);
            validations.checkNull("tanno", organizations[i].tanno, "TAN no is required", validationObject);
            validations.checkNull("panno", organizations[i].panno, "PAN no is required", validationObject);
            validations.checkNull("gstno", organizations[i].gstno, "GST no is required", validationObject);
            validations.checkNull("country", organizations[i].country, "Country is required", validationObject);
            validations.checkNull("website", organizations[i].website, "Website is required", validationObject);
            validations.checkNull("hrheadfirstname", organizations[i].hrheadfirstname, "First name is required", validationObject);
            validations.checkNull("hrheademailid", organizations[i].hrheademailid, "Email id is required", validationObject);
            validations.checkNull("ceofirstname", organizations[i].ceofirstname, "First name is required", validationObject);
            validations.checkNull("ceoemailid", organizations[i].ceoemailid, "Email id is required", validationObject);
            validations.checkNull("cfofirstname", organizations[i].cfofirstname, "First name is required", validationObject);
            validations.checkNull("cfoemailid", organizations[i].cfoemailid, "Email id is required", validationObject);
            validations.checkNull("technology", organizations[i].technology, "Technology is required", validationObject);

            validations.checkMaxLength("name", organizations[i].name, 100, "Length of Organization name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("tanno", organizations[i].tanno, 100, "Length of TAN no should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("panno", organizations[i].panno, 100, "Length of PAN no should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("gstno", organizations[i].gstno, 100, "Length of GST no should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("country", organizations[i].country, 100, "Length of Country should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("website", organizations[i].website, 100, "Length of Website should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("hrheadfirstname", organizations[i].hrheadfirstname, 100, "Length of First name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("hrheademailid", organizations[i].hrheademailid, 100, "Length of Email id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("hrheadlastname", organizations[i].hrheadlastname, 100, "Length of Last name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("hrheademployeeid", organizations[i].hrheademployeeid, 100, "Length of Employee id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("ceofirstname", organizations[i].ceofirstname, 100, "Length of First name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("ceoemailid", organizations[i].ceoemailid, 100, "Length of Email id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("ceolastname", organizations[i].ceolastname, 100, "Length of Last name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("ceoemployeeid", organizations[i].ceoemployeeid, 100, "Length of Employee id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("cfofirstname", organizations[i].cfofirstname, 100, "Length of First name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("cfoemailid", organizations[i].cfoemailid, 100, "Length of Email id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("cfolastname", organizations[i].cfolastname, 100, "Length of Last name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("cfoemployeeid", organizations[i].cfoemployeeid, 100, "Length of Employee id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("alternatecontactfirstname", organizations[i].alternatecontactfirstname, 100, "Length of First name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("alternatecontactemailid", organizations[i].alternatecontactemailid, 100, "Length of Email id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("alternatecontactlastname", organizations[i].alternatecontactlastname, 100, "Length of Last name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("alternatecontactemployeeid", organizations[i].alternatecontactemployeeid, 100, "Length of Employee id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("technology", organizations[i].technology, 500, "Length of Technology should be less than or equal to 500 characters", validationObject);
            validations.checkMaxLength("noofemployees", organizations[i].noofemployees, 500, "Length of No of employees should be less than or equal to 500 characters", validationObject);
            validations.checkMaxLength("employeeturnover", organizations[i].employeeturnover, 500, "Length of Employee turnover should be less than or equal to 500 characters", validationObject);

            validations.checkEmail("hrheademailid", organizations[i].hrheademailid, "Email id is not valid", validationObject);
            validations.checkEmail("ceoemailid", organizations[i].ceoemailid, "Email id is not valid", validationObject);
            validations.checkEmail("cfoemailid", organizations[i].cfoemailid, "Email id is not valid", validationObject);
            validations.checkEmail("alternatecontactemailid", organizations[i].alternatecontactemailid, "Email id is not valid", validationObject);
            
            if(Object.keys(validationObject).length != 0)
                validationObjects[i] = validationObject;

        }
        
        // if data is not valid, throw validation errors
        if(Object.keys(validationObjects).length != 0)
        {
            throw new Error(JSON.stringify(validationObjects));
        }
        else
        { 
            let organizationID;
    
            // Get system date and time
            let curDate = sysdate_yyyymmdd;
            let curTime = systime_hh24mmss;
            
            for(let i = 0; i < organizations.length; i++)
            {
                // Get auto-generated number for organizations id
                //nextNumber = await numberSeries.getNextSeriesNumber(organizations[i].CLNT, "NA", "CNTID");
                organizationID = sysdate_yyyymmdd + systime_hh24mmss + math.randomInt(101, 999);
                
                // Add auto-generated number as organizations id
                organizations[i].organizationid = organizationID;

                organizations[i].status = "NEW";

                // Add create params
                organizations[i].cdate = curDate;
                organizations[i].ctime = curTime;
                organizations[i].isdel = false;
                
            }
        
            return organizations;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}



// Validation funtion for update
const validateUPDATEData = async (organizations) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < organizations.length; i++)
        {
            let validationObject = {};

            validations.checkNull("client", organizations[i].client, "Client is required", validationObject);
            validations.checkNull("lang", organizations[i].lang, "Language is required", validationObject);
            validations.checkNull("organizationid", organizations[i].organizationid, "Organization id is required", validationObject);

            validations.checkNull("name", organizations[i].name, "Organization name is required", validationObject);
            validations.checkNull("tanno", organizations[i].tanno, "TAN no is required", validationObject);
            validations.checkNull("panno", organizations[i].panno, "PAN no is required", validationObject);
            validations.checkNull("gstno", organizations[i].gstno, "GST no is required", validationObject);
            validations.checkNull("country", organizations[i].country, "Country is required", validationObject);
            validations.checkNull("website", organizations[i].website, "Website is required", validationObject);
            validations.checkNull("hrheadfirstname", organizations[i].hrheadfirstname, "First name is required", validationObject);
            validations.checkNull("hrheademailid", organizations[i].hrheademailid, "Email id is required", validationObject);
            validations.checkNull("ceofirstname", organizations[i].ceofirstname, "First name is required", validationObject);
            validations.checkNull("ceoemailid", organizations[i].ceoemailid, "Email id is required", validationObject);
            validations.checkNull("cfofirstname", organizations[i].cfofirstname, "First name is required", validationObject);
            validations.checkNull("cfoemailid", organizations[i].cfoemailid, "Email id is required", validationObject);
            validations.checkNull("technology", organizations[i].technology, "Technology is required", validationObject);

            validations.checkMaxLength("name", organizations[i].name, 100, "Length of Organization name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("tanno", organizations[i].tanno, 100, "Length of TAN no should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("panno", organizations[i].panno, 100, "Length of PAN no should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("gstno", organizations[i].gstno, 100, "Length of GST no should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("country", organizations[i].country, 100, "Length of Country should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("website", organizations[i].website, 100, "Length of Website should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("hrheadfirstname", organizations[i].hrheadfirstname, 100, "Length of First name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("hrheademailid", organizations[i].hrheademailid, 100, "Length of Email id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("hrheadlastname", organizations[i].hrheadlastname, 100, "Length of Last name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("hrheademployeeid", organizations[i].hrheademployeeid, 100, "Length of Employee id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("ceofirstname", organizations[i].ceofirstname, 100, "Length of First name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("ceoemailid", organizations[i].ceoemailid, 100, "Length of Email id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("ceolastname", organizations[i].ceolastname, 100, "Length of Last name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("ceoemployeeid", organizations[i].ceoemployeeid, 100, "Length of Employee id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("cfofirstname", organizations[i].cfofirstname, 100, "Length of First name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("cfoemailid", organizations[i].cfoemailid, 100, "Length of Email id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("cfolastname", organizations[i].cfolastname, 100, "Length of Last name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("cfoemployeeid", organizations[i].cfoemployeeid, 100, "Length of Employee id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("alternatecontactfirstname", organizations[i].alternatecontactfirstname, 100, "Length of First name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("alternatecontactemailid", organizations[i].alternatecontactemailid, 100, "Length of Email id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("alternatecontactlastname", organizations[i].alternatecontactlastname, 100, "Length of Last name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("alternatecontactemployeeid", organizations[i].alternatecontactemployeeid, 100, "Length of Employee id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("technology", organizations[i].technology, 500, "Length of Technology should be less than or equal to 500 characters", validationObject);
            validations.checkMaxLength("noofemployees", organizations[i].noofemployees, 500, "Length of No of employees should be less than or equal to 500 characters", validationObject);
            validations.checkMaxLength("employeeturnover", organizations[i].employeeturnover, 500, "Length of Employee turnover should be less than or equal to 500 characters", validationObject);

            validations.checkEmail("hrheademailid", organizations[i].hrheademailid, "Email id is not valid", validationObject);
            validations.checkEmail("ceoemailid", organizations[i].ceoemailid, "Email id is not valid", validationObject);
            validations.checkEmail("cfoemailid", organizations[i].cfoemailid, "Email id is not valid", validationObject);
            validations.checkEmail("alternatecontactemailid", organizations[i].alternatecontactemailid, "Email id is not valid", validationObject);
            
            if(Object.keys(validationObject).length != 0)
                validationObjects[i] = validationObject;

        }
        
        // if data is not valid, throw validation errors
        if(Object.keys(validationObjects).length != 0)
        {
            throw new Error(JSON.stringify(validationObjects));
        }
        else
        { 
            // Get system date and time
            let curDate = sysdate_yyyymmdd;
            let curTime = systime_hh24mmss;
            
            for(let i = 0; i < organizations.length; i++)
            {
                // Add update params
                organizations[i].udate = curDate;
                organizations[i].utime = curTime;
                
            }
        
            return organizations;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for delete
const validateDELETEData = async (organizations) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < organizations.length; i++)
        {
            let validationObject = {};

            validations.checkNull("client", organizations[i].client, "Client is required", validationObject);
            validations.checkNull("lang", organizations[i].lang, "Language is required", validationObject);
            validations.checkNull("organizationid", organizations[i].organizationid, "Organization id is required", validationObject);

            
            if(Object.keys(validationObject).length != 0)
                validationObjects[i] = validationObject;

        }
        
        // if data is not valid, throw validation errors
        if(Object.keys(validationObjects).length != 0)
        {
            throw new Error(JSON.stringify(validationObjects));
        }
        else
        { 
            // Get system date and time
            let curDate = sysdate_yyyymmdd;
            let curTime = systime_hh24mmss;
            
            for(let i = 0; i < organizations.length; i++)
            {
                // Add update params
                organizations[i].ddate = curDate;
                organizations[i].dtime = curTime;
                organizations[i].isdel = true;
                
            }
        
            return organizations;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// create organizations
const createOrganizations = async (organizations) =>
{
    try 
    {
        let createOrganizationJSON;    
        let organizationIDs = [];

        for( let i = 0; i < organizations.length; i++)
        {
            // form the create json object
            createOrganizationJSON = {
                "client" 		:	organizations[i].client,
                "lang"		    :	organizations[i].lang,
                "organizationid"	: 	organizations[i].organizationid,
                "name"	        :	organizations[i].name,
                "tanno"	        :	organizations[i].tanno,
                "panno"	        :	organizations[i].panno,
                "gstno"		    :	organizations[i].gstno,
                "country"		:	organizations[i].country,
                "website"	    :	organizations[i].website,
                "hrheadfirstname"	    :	organizations[i].hrheadfirstname,
                "hrheadlastname"	    :	organizations[i].hrheadlastname,
                "hrheademployeeid"	    :	organizations[i].hrheademployeeid,
                "hrheademailid"		    :	organizations[i].hrheademailid,
                "alternatecontactfirstname"	    :	organizations[i].alternatecontactfirstname,
                "alternatecontactlastname"	    :	organizations[i].alternatecontactlastname,
                "alternatecontactemployeeid"	:	organizations[i].alternatecontactemployeeid,
                "alternatecontactemailid"		:	organizations[i].alternatecontactemailid,
                "ceofirstname"	    :	organizations[i].ceofirstname,
                "ceolastname"	    :	organizations[i].ceolastname,
                "ceoemployeeid"	    :	organizations[i].ceoemployeeid,
                "ceoemailid"		:	organizations[i].ceoemailid,
                "cfofirstname"	    :	organizations[i].cfofirstname,
                "cfolastname"	    :	organizations[i].cfolastname,
                "cfoemployeeid"	    :	organizations[i].cfoemployeeid,
                "cfoemailid"		:	organizations[i].cfoemailid,
                "noofemployees"	    :	organizations[i].noofemployees,
                "employeeturnover"	:	organizations[i].employeeturnover,
                "technology"	    :	organizations[i].technology,
                "status"	    :	organizations[i].status,
                "cdate"         :   organizations[i].cdate,
                "ctime"         :   organizations[i].ctime,
                "isdel"         :   organizations[i].isdel
            }
            
            organizationIDs[i] = organizations[i].organizationid;

            // Instanciate Organization Model                    
            const organizationModelInst = new organizationModel(createOrganizationJSON);
        
            // Save the Organization record
            let result = await organizationModelInst.save();             
        }
        
        //return organizations.length;
        return organizationIDs;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// update organizations
const updateOrganizations = async (organizations) =>
{
    try 
    {
        let updateOrganizationDataJSON;
        let updateOrganizationClauseJSON;    
        let organizationIDs = [];
        
        for( let i = 0; i < organizations.length; i++)
        {
            // form the data json object
            updateOrganizationDataJSON = {
                "client" 		:	organizations[i].client,
                "lang"		    :	organizations[i].lang,
                "organizationid"	: 	organizations[i].organizationid,
                "name"	        :	organizations[i].name,
                "tanno"	        :	organizations[i].tanno,
                "panno"	        :	organizations[i].panno,
                "gstno"		    :	organizations[i].gstno,
                "country"		:	organizations[i].country,
                "website"	    :	organizations[i].website,
                "hrheadfirstname"	    :	organizations[i].hrheadfirstname,
                "hrheadlastname"	    :	organizations[i].hrheadlastname,
                "hrheademployeeid"	    :	organizations[i].hrheademployeeid,
                "hrheademailid"		    :	organizations[i].hrheademailid,
                "alternatecontactfirstname"	    :	organizations[i].alternatecontactfirstname,
                "alternatecontactlastname"	    :	organizations[i].alternatecontactlastname,
                "alternatecontactemployeeid"	:	organizations[i].alternatecontactemployeeid,
                "alternatecontactemailid"		:	organizations[i].alternatecontactemailid,
                "ceofirstname"	    :	organizations[i].ceofirstname,
                "ceolastname"	    :	organizations[i].ceolastname,
                "ceoemployeeid"	    :	organizations[i].ceoemployeeid,
                "ceoemailid"		:	organizations[i].ceoemailid,
                "cfofirstname"	    :	organizations[i].cfofirstname,
                "cfolastname"	    :	organizations[i].cfolastname,
                "cfoemployeeid"	    :	organizations[i].cfoemployeeid,
                "cfoemailid"		:	organizations[i].cfoemailid,
                "noofemployees"	    :	organizations[i].noofemployees,
                "employeeturnover"	:	organizations[i].employeeturnover,
                "technology"	    :	organizations[i].technology,
                "udate"         :   organizations[i].udate,
                "utime"         :   organizations[i].utime
            }

            organizationIDs[i] = organizations[i].organizationid;

            // form the clause json object
            updateOrganizationClauseJSON = {
                "client" 		:	organizations[i].client,
                "lang"		    :	organizations[i].lang,
                "organizationid"	: 	organizations[i].organizationid
            }
            
            // Update Organization record
            let result = await organizationModel.findOneAndUpdate(updateOrganizationClauseJSON, updateOrganizationDataJSON, {new : true});    

        }
        
        //return organizations.length;
        return organizationIDs;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// logical delete organizations
const logicalDeleteOrganizations = async (organizations) =>
{
    try 
    {
        let updateOrganizationDataJSON;
        let updateOrganizationClauseJSON;    
        let organizationIDs = [];
        
        for( let i = 0; i < organizations.length; i++)
        {
            // form the data json object
            updateOrganizationDataJSON = {
                "ddate"         :   organizations[i].ddate,
                "dtime"         :   organizations[i].dtime,
                "isdel"         :   organizations[i].isdel
            }

            organizationIDs[i] = organizations[i].organizationid;

            // form the clause json object
            updateOrganizationClauseJSON = {
                "client" 		:	organizations[i].client,
                "lang"		    :	organizations[i].lang,
                "organizationid"	: 	organizations[i].organizationid
            }

            let result = await organizationModel.findOneAndUpdate(updateOrganizationClauseJSON, updateOrganizationDataJSON, {new : true});    

        }
        
        //return organizations.length;
        return organizationIDs;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// physical delete organizations
const physicalDeleteOrganizations = async (organizations) =>
{
    try 
    {
        let deleteOrganizationClauseJSON;    
        let organizationIDs = [];
        
        for( let i = 0; i < organizations.length; i++)
        {
            // form the clause json object
            deleteOrganizationClauseJSON = {
                "client" 		:	organizations[i].client,
                "lang"		    :	organizations[i].lang,
                "organizationid"	: 	organizations[i].organizationid
            }

            organizationIDs[i] = organizations[i].organizationid;

            let result = await organizationModel.findOneAndRemove(deleteOrganizationClauseJSON);    

        }
        
        //return organizations.length;
        return organizationIDs;
  
    } 
    catch (error) 
    {
        return error;        
    }

}


// Export function modules
module.exports = {
    searchOrganizations,
    OrganizationsCRUDOps
};