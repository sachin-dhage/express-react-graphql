// import section
import connection from "../config/db/dbConnect";
import {cvsummaryModel} from "../models/mongoose";
import math from 'mathjs';
import validations from '../common/validations';

//Import the date format module
import dateFormat from 'dateformat';
var now = new Date();
var sysdate_yyyymmdd = dateFormat(new Date(),'yyyymmdd');
var systime_hh24mmss = dateFormat(new Date(),'HHMMss');


// Resolver function for query searchOrganizations({input}) : [Organization]
const searchCVSummary = async (args, context, info) =>
{
    let exactMatch = true;
    let conditions;


    if(exactMatch)
    {
        conditions = {
            client : ((typeof args.client !== 'undefined' && args.client.trim() ) ? args.client.trim() : new RegExp(args.client,'i') ),
            lang : ((typeof args.lang !== 'undefined' && args.lang.trim() ) ? args.lang.trim() : new RegExp(args.lang,'i') ),
            cvid : ((typeof args.cvid !== 'undefined' && args.cvid.trim() ) ? args.cvid.trim() : new RegExp(args.cvid,'i') ),
            //executionid : ((typeof args.executionid !== 'undefined' && args.executionid.trim() ) ? args.executionid.trim() : new RegExp(args.executionid,'i') ),
            isdel : false
        };

    }
    else
    {
        conditions = {
            client : ((typeof args.client !== 'undefined' && args.client.trim() ) ? args.client.trim() : new RegExp(args.client,'i') ),
            lang : ((typeof args.lang !== 'undefined' && args.lang.trim() ) ? args.lang.trim() : new RegExp(args.lang,'i') ),
            cvid : new RegExp(( typeof args.cvid !== 'undefined' ? args.cvid.trim() : args.cvid),'i'),
            //executionid : new RegExp(( typeof args.executionid !== 'undefined' ? args.executionid.trim() : args.executionid),'i'),
            isdel : false
        };
    }

    /*console.log("\nconditions => ");
    console.log(conditions);  */

    //return cvsummaryModel.find(conditions);
    /* Query Structure =>
        $match : Where clause
        $group : Group By clause
        $project : Select clause    0 : No Selection,       1 : Selection
        $sort : Order By clause     1 : Ascending order,    -1 : Descending order
     */

    /* return cvsummaryModel.aggregate([
        { $match : conditions },
        { $group : { _id : { client : "$client", lang : "$lang", cvid : "$cvid", category : "$category", attribute : "$attribute", count : "$count", inference : "$inference" }, maxexeid: { $max : "$executionid" } } },
        { $project : { _id : 0, client : "$_id.client", lang : "$_id.lang", cvid : "$_id.cvid", executionid : "$maxexeid", category : "$_id.category" , attribute : "$_id.attribute", count : "$_id.count", inference : "$_id.inference" } },
        { $sort : { category : 1,  attribute : 1, inference : 1} }
       ]); */

    let result = await cvsummaryModel.aggregate([
        { $match : conditions },
        { $group : {    _id : { client : "$client", lang : "$lang", cvid : "$cvid"} ,  
                        maxexeid: { $max : "$executionid" }, 
                        cvsummary : { $push : {client : "$client", lang : "$lang", cvid : "$cvid", executionid : "$executionid", category : "$category", attribute : "$attribute", count : "$count", inference : "$inference"} } 
                    } 
        },
        { $project : 
            {   _id : 0,  
                summary : { $filter : { input : "$cvsummary", as : "cvs", cond : { $eq : ["$$cvs.executionid", "$maxexeid"] }  } }
            } 
        }        
    ]);

    //console.log("result => ");        console.log(result[0].summary);

    return result[0].summary;


}



/**
 * CRUD Operations for CVSummary
 **/
// Resolver function for mutation CVSummaryCRUDOps(input) : String
const CVSummaryCRUDOps = async (args, context, info) =>
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
            //let cvsummaries = await validateCREATEData(args.cvsummaries);
            let cvsummaries = args.cvsummaries;

            

           // console.log("Process Start (Create CV Summary Categories)       : " +  dateFormat(new Date(),'yyyymmdd HHMMss') ); 
            affectedRecords = await createCVSummaries(cvsummaries);
           // console.log("Process END   (Create CV Summary Categories)(rows) : ("+affectedRecords+")" + dateFormat(new Date(),'yyyymmdd HHMMss') ); 
            

            /*//Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCVSummary(cvsummaries);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createCVSummary(cvsummaries);
            }*/

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            //let cvsummaries = await validateUPDATEData(args.cvsummaries);
            let cvsummaries = args.cvsummaries;

            // Update candidate data
            affectedRecords = await updateCVSummaries(cvsummaries);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCVSummary(cvsummaries);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cvsummaries.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateCVSummary(cvsummaries);
            }*/

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            //let cvsummaries = await validateDELETEData(args.cvsummaries);
            let cvsummaries = args.cvsummaries;

            // Logical delete candidate data
            affectedRecords = await logicalDeleteCVSummaries(cvsummaries);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCVSummary(cvsummaries);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cvsummaries.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteCVSummary(cvsummaries);
            }*/

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            //let cvsummaries = await validateDELETEData(args.cvsummaries);
            let cvsummaries = args.cvsummaries;

            // Physical delete candidate data
            affectedRecords = await physicalDeleteCVSummaries(cvsummaries);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCVSummary(cvsummaries);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != cvsummaries.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCVSummary(cvsummaries);
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



/* // create CV Summaries
const createCVSummaries = async (cvsummaries) =>
{
    try 
    {
        let createCVSummaryJSON;    
        
        for( let i = 0; i < cvsummaries.length; i++)
        {
            // form the create json object
            createCVSummaryJSON = {
                "client" 		:	cvsummaries[i].client,
                "lang"		    :	cvsummaries[i].lang,
                "cvid"	        : 	cvsummaries[i].cvid,
                "executionid"	:	cvsummaries[i].executionid,
                "category"	    :	cvsummaries[i].category,
                "attribute"	    :	cvsummaries[i].attribute,
                "count"		    :	cvsummaries[i].count,
                "inference"		:	cvsummaries[i].inference,
                "cdate"         :   sysdate_yyyymmdd,
                "ctime"         :   systime_hh24mmss,
                "isdel"         :   false
            }
        
            // Instanciate Candidate Model                    
            const cvsummaryModelInst = new cvsummaryModel(createCVSummaryJSON);
        
            // Save the candidate record
            let result = await cvsummaryModelInst.save();
        }           
        
        return cvsummaries.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}
 */


// create CV Summaries - Updated for Bulk insert
const createCVSummaries = async (cvsummaries) =>
{
    try 
    {
        
        for( let i = 0; i < cvsummaries.length; i++)
        {
            // add create params
            cvsummaries[i].cdate = sysdate_yyyymmdd;
            cvsummaries[i].ctime = systime_hh24mmss;
            cvsummaries[i].isdel = false;
        
        } 
          
        // Bulk insert Summaries
        await cvsummaryModel.insertMany(cvsummaries);        
        
        return cvsummaries.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// update CV Summaries
const updateCVSummaries = async (cvsummaries) =>
{
    try 
    {
        let updateCVSummaryDataJSON;
        let updateCVSummaryClauseJSON;    
        
        for( let i = 0; i < cvsummaries.length; i++)
        {
            // form the data json object
            updateCVSummaryDataJSON = {
                "category"	    :	cvsummaries[i].category,
                "attribute"	    :	cvsummaries[i].attribute,
                "count"		    :	cvsummaries[i].count,
                "inference"		:	cvsummaries[i].inference,
                "udate"         :   sysdate_yyyymmdd,
                "utime"         :   systime_hh24mmss,
            }

            // form the clause json object
            updateCVSummaryClauseJSON = {
                "client" 		:	cvsummaries[i].client,
                "lang"		    :	cvsummaries[i].lang,
                "cvid"	        : 	cvsummaries[i].cvid,
                "executionid"	:	cvsummaries[i].executionid
            }
            
            // Update Organization record
            let result = await cvsummaryModel.findOneAndUpdate(updateCVSummaryClauseJSON, updateCVSummaryDataJSON, {new : true});    

        }
        
        return cvsummaries.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// logical delete CV Summaries
const logicalDeleteCVSummaries = async (cvsummaries) =>
{
    try 
    {
        let updateCVSummaryDataJSON;
        let updateCVSummaryClauseJSON;    
        
        for( let i = 0; i < cvsummaries.length; i++)
        {
            // form the data json object
            updateCVSummaryDataJSON = {
                "ddate"         :   sysdate_yyyymmdd,
                "dtime"         :   systime_hh24mmss,
                "isdel"         :   true
            }

            // form the clause json object
            updateCVSummaryClauseJSON = {
                "client" 		:	cvsummaries[i].client,
                "lang"		    :	cvsummaries[i].lang,
                "cvid"	        : 	cvsummaries[i].cvid,
                "executionid"	:	cvsummaries[i].executionid
            }

            let result = await cvsummaryModel.findOneAndUpdate(updateCVSummaryClauseJSON, updateCVSummaryDataJSON, {new : true});    

        }
        
        return cvsummaries.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// physical delete CV Summaries
const physicalDeleteCVSummaries = async (cvsummaries) =>
{
    try 
    {
        let deleteCVSummaryClauseJSON;    
        
        for( let i = 0; i < cvsummaries.length; i++)
        {
            // form the clause json object
            deleteCVSummaryClauseJSON = {
                "client" 		:	cvsummaries[i].client,
                "lang"		    :	cvsummaries[i].lang,
                "cvid"	        : 	cvsummaries[i].cvid,
                "executionid"	:	cvsummaries[i].executionid
            }

            let result = await cvsummaryModel.findOneAndRemove(deleteCVSummaryClauseJSON);    

        }
        
        return cvsummaries.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// Export function modules
module.exports = {
    searchCVSummary,
   CVSummaryCRUDOps
};