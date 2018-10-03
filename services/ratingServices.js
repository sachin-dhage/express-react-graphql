// import section
import connection from "../config/db/dbConnect";
import {ratingModel} from "../models/mongoose";
import math from 'mathjs';
import validations from '../common/validations';

//Import the date format module
import dateFormat from 'dateformat';
var now = new Date();
var sysdate_yyyymmdd = dateFormat(now,'yyyymmdd');
var systime_hh24mmss = dateFormat(now,'HHMMss');


// Resolver function for query searchRatings({input}) : [Ratings]
const searchCandidateRatings = (args, context, info) =>
{
    let conditions;
    
    conditions = {
        client : ((typeof args.client !== 'undefined' && args.client.trim() ) ? args.client.trim() : new RegExp(args.client,'i') ),
        lang : ((typeof args.lang !== 'undefined' && args.lang.trim() ) ? args.lang.trim() : new RegExp(args.lang,'i') ),
        candidateid : ((typeof args.candidateid !== 'undefined' && args.candidateid.trim() ) ? args.candidateid.trim() : new RegExp(args.candidateid,'i') ),
        isdel : false
    };

    /* console.log("\nconditions => ");
    console.log(conditions);  */

    return ratingModel.find(conditions);
}



/**
 * CRUD Operations for Ratings
 **/
// Resolver function for mutation RatingsCRUDOps(input) : String
const RatingsCRUDOps = async (args, context, info) =>
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
            let ratings = await validateCREATEData(args.ratings);

            // Create ratings data
            affectedRecords = await createRatings(ratings);

            /*//Check uniqueness of input data
            let duplicateObj =  await checkDuplicateRatings(ratings);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createRatings(ratings);
            }*/

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let ratings = await validateUPDATEData(args.ratings);

            // Update ratings data
            affectedRecords = await updateRatings(ratings);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateRatings(ratings);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != ratings.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateRatings(ratings);
            }*/

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let ratings = await validateDELETEData(args.ratings);

            // Logical delete ratings data
            affectedRecords = await logicalDeleteRatings(ratings);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateRatings(ratings);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != ratings.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteRatings(ratings);
            }*/

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let ratings = await validateDELETEData(args.ratings);

            // Physical delete ratings data
            affectedRecords = await physicalDeleteRatings(ratings);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateRatings(ratings);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != ratings.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteRatings(ratings);
            }*/

        }
        else if(transaction == "LOGICAL_DELETE_ALL")    // Logical delete all records
        {

            // Validate input data
            let ratings = await validateDELETEALLData(args.ratings);

            // Logical delete ratings data
            affectedRecords = await logicalDeleteAllRatings(ratings);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateRatings(ratings);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != ratings.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteRatings(ratings);
            }*/

        }   
        else if(transaction == "PHYSICAL_DELETE_ALL")   // Physical delete all records
        {

            // Validate input data
            let ratings = await validateDELETEALLData(args.ratings);

            // Physical delete ratings data
            affectedRecords = await physicalDeleteAllRatings(ratings);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateRatings(ratings);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != ratings.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteRatings(ratings);
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
const validateCREATEData = async (ratings) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < ratings.length; i++)
        {
            let validationObject = {};

            validations.checkNull("client", ratings[i].client, "Client is required", validationObject);
            validations.checkNull("lang", ratings[i].lang, "Language is required", validationObject);
            validations.checkNull("candidateid", ratings[i].candidateid, "Candidate id is required", validationObject);
            validations.checkNull("technology", ratings[i].technology, "Technology is required", validationObject);
            validations.checkNull("rating", ratings[i].rating, "Rating is required", validationObject);

            validations.checkMaxLength("candidateid", ratings[i].candidateid, 100, "Length of Candidate id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("technology", ratings[i].technology, 100, "Length of Technology should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("rating", ratings[i].rating, 10, "Length of Rating should be less than or equal to 10 characters", validationObject);

            validations.checkNumber("rating", ratings[i].rating, "Rating should be a number", validationObject);
            
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
            let ratingID;
    
            // Get system date and time
            let curDate = sysdate_yyyymmdd;
            let curTime = systime_hh24mmss;
            
            for(let i = 0; i < ratings.length; i++)
            {
                // Get auto-generated number for ratings id
                //nextNumber = await numberSeries.getNextSeriesNumber(ratings[i].CLNT, "NA", "CNTID");
                ratingID = sysdate_yyyymmdd + systime_hh24mmss + math.randomInt(101, 999);
                
                // Add auto-generated number as ratings id
                ratings[i].ratingid = ratingID;

                // Add create params
                ratings[i].cdate = curDate;
                ratings[i].ctime = curTime;
                ratings[i].isdel = false;
                
            }
        
            return ratings;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for update
const validateUPDATEData = async (ratings) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < ratings.length; i++)
        {
            let validationObject = {};

            validations.checkNull("client", ratings[i].client, "Client is required", validationObject);
            validations.checkNull("lang", ratings[i].lang, "Language is required", validationObject);
            validations.checkNull("candidateid", ratings[i].candidateid, "Candidate id is required", validationObject);
            validations.checkNull("ratingid", ratings[i].ratingid, "Rating id is required", validationObject);
            validations.checkNull("technology", ratings[i].technology, "Technology is required", validationObject);
            validations.checkNull("rating", ratings[i].rating, "Rating is required", validationObject);

            validations.checkMaxLength("candidateid", ratings[i].candidateid, 100, "Length of Candidate id should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("technology", ratings[i].technology, 100, "Length of Technology should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("rating", ratings[i].rating, 10, "Length of Rating should be less than or equal to 10 characters", validationObject);

            validations.checkNumber("rating", ratings[i].rating, "Rating should be a number", validationObject);
            
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
            
            for(let i = 0; i < ratings.length; i++)
            {
                // Add update params
                ratings[i].udate = curDate;
                ratings[i].utime = curTime;
                
            }
        
            return ratings;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}



// Validation funtion for delete
const validateDELETEData = async (ratings) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < ratings.length; i++)
        {
            let validationObject = {};

            validations.checkNull("client", ratings[i].client, "Client is required", validationObject);
            validations.checkNull("lang", ratings[i].lang, "Language is required", validationObject);
            validations.checkNull("candidateid", ratings[i].candidateid, "Candidate id is required", validationObject);
            validations.checkNull("ratingid", ratings[i].ratingid, "Rating id is required", validationObject);

            
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
            
            for(let i = 0; i < ratings.length; i++)
            {
                // Add update params
                ratings[i].ddate = curDate;
                ratings[i].dtime = curTime;
                ratings[i].isdel = true;
                
            }
        
            return ratings;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for delete all records
const validateDELETEALLData = async (ratings) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < ratings.length; i++)
        {
            let validationObject = {};

            validations.checkNull("client", ratings[i].client, "Client is required", validationObject);
            validations.checkNull("lang", ratings[i].lang, "Language is required", validationObject);
            validations.checkNull("candidateid", ratings[i].candidateid, "Candidate id is required", validationObject);
            
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
            
            for(let i = 0; i < ratings.length; i++)
            {
                // Add update params
                ratings[i].ddate = curDate;
                ratings[i].dtime = curTime;
                ratings[i].isdel = true;
                
            }
        
            return ratings;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}



// create ratings
const createRatings = async (ratings) =>
{
    try 
    {
        let createRatingJSON;   
               
        for( let i = 0; i < ratings.length; i++)
        {
            // form the create json object
            createRatingJSON = {
            "client" 		:	ratings[i].client,
            "lang"		    :	ratings[i].lang,
            "candidateid"	: 	ratings[i].candidateid,
            "ratingid"	    :	ratings[i].ratingid,
            "technology"	:	ratings[i].technology,
            "rating"		:	ratings[i].rating,
            "cdate"         :   ratings[i].cdate,
            "ctime"         :   ratings[i].ctime,
            "isdel"         :   ratings[i].isdel
        }

        
            // Instanciate Rating Model                    
            const ratingModelInst = new ratingModel(createRatingJSON);
     
            // Save the record
            let result = await ratingModelInst.save();
    
        }
        
        return ratings.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// update ratings
const updateRatings = async (ratings) =>
{
    try 
    {
        let updateRatingDataJSON;
        let updateRatingClauseJSON;    
        
        for( let i = 0; i < ratings.length; i++)
        {
            // form the data json object
            updateRatingDataJSON = {
                "technology"	:	ratings[i].technology,
                "rating"		:	ratings[i].rating,
                "udate"         :   ratings[i].udate,
                "utime"         :   ratings[i].utime
            }

            // form the clause json object
            updateRatingClauseJSON = {
                "client" 		:	ratings[i].client,
                "lang"		    :	ratings[i].lang,
                "candidateid"	: 	ratings[i].candidateid,
                "ratingid"	    : 	ratings[i].ratingid
            }

            let result = await ratingModel.findOneAndUpdate(updateRatingClauseJSON, updateRatingDataJSON, {new : true});    
        }
        
        return ratings.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// logical delete ratings
const logicalDeleteRatings = async (ratings) =>
{
    try 
    {
        let updateRatingDataJSON;
        let updateRatingClauseJSON;    
        
        for( let i = 0; i < ratings.length; i++)
        {
            // form the data json object
            updateRatingDataJSON = {
                "ddate"         :   ratings[i].ddate,
                "dtime"         :   ratings[i].dtime,
                "isdel"         :   ratings[i].isdel
            }

            // form the clause json object
            updateRatingClauseJSON = {
                "client" 		:	ratings[i].client,
                "lang"		    :	ratings[i].lang,
                "candidateid"	: 	ratings[i].candidateid,
                "ratingid"	    : 	ratings[i].ratingid
            }

            let result = await ratingModel.findOneAndUpdate(updateRatingClauseJSON, updateRatingDataJSON, {new : true});    
        }
        
        return ratings.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// physical delete ratings
const physicalDeleteRatings = async (ratings) =>
{
    try 
    {
        let deleteRatingClauseJSON;    
        
        for( let i = 0; i < ratings.length; i++)
        {

            // form the clause json object
            deleteRatingClauseJSON = {
                "client" 		:	ratings[i].client,
                "lang"		    :	ratings[i].lang,
                "candidateid"	: 	ratings[i].candidateid,
                "ratingid"	    : 	ratings[i].ratingid
            }

            let result = await ratingModel.findOneAndRemove(deleteRatingClauseJSON);    
        }
        
        return ratings.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// logical delete all ratings
const logicalDeleteAllRatings = async (ratings) =>
{
    try 
    {
        let updateRatingDataJSON;
        let updateRatingClauseJSON;    
        
        for( let i = 0; i < ratings.length; i++)
        {
            // form the data json object
            updateRatingDataJSON = {
                "ddate"         :   ratings[i].ddate,
                "dtime"         :   ratings[i].dtime,
                "isdel"         :   ratings[i].isdel
            }

            // form the clause json object
            updateRatingClauseJSON = {
                "client" 		:	ratings[i].client,
                "lang"		    :	ratings[i].lang,
                "candidateid"	: 	ratings[i].candidateid
            }


            let result = await ratingModel.updateMany(updateRatingClauseJSON, updateRatingDataJSON, {new : true});    
        }
        
        return ratings.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// physical delete all ratings
const physicalDeleteAllRatings = async (ratings) =>
{
    try 
    {
        let deleteRatingClauseJSON;    
        
        for( let i = 0; i < ratings.length; i++)
        {
            // form the clause json object
            deleteRatingClauseJSON = {
                "client" 		:	ratings[i].client,
                "lang"		    :	ratings[i].lang,
                "candidateid"	: 	ratings[i].candidateid
            }
    
            let result = await ratingModel.remove(deleteRatingClauseJSON);    
        }
        
        return ratings.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}

// Export function modules
module.exports = {
    searchCandidateRatings,
    RatingsCRUDOps
};