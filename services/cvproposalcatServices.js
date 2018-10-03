// import section
import connection from "../config/db/dbConnect";
import {cvproposalcatModel } from "../models/mongoose";
import math from 'mathjs';
import validations from '../common/validations';
const fs =require('fs')

//Import the date format module
import dateFormat from 'dateformat';
var now = new Date();
var sysdate_yyyymmdd = dateFormat(new Date(),'yyyymmdd');
var systime_hh24mmss = dateFormat(new Date(),'HHMMss');



// Resolver function for query searchProposalCategories({input}) : [CVProposalCategories]
const searchProposalCategories = async (args, context, info) =>
{
    let conditions;
    let havingCount;
    let exactMatch =args.exactMatch

    // condition object
    if(exactMatch){
        conditions = {
            "client" : ((typeof args.client !== 'undefined' && args.client.trim() ) ? args.client.trim() : new RegExp(args.client,'i') ),
            "lang" : ((typeof args.lang !== 'undefined' && args.lang.trim() ) ? args.lang.trim() : new RegExp(args.lang,'i') ),
            "attribute" : new RegExp('^'+( typeof args.attribute !== 'undefined' ? args.attribute.trim() : args.attribute)+'$','i'),      
            "isdel" : false
        };

    }
    else{
    conditions = {
        "client" : ((typeof args.client !== 'undefined' && args.client.trim() ) ? args.client.trim() : new RegExp(args.client,'i') ),
        "lang" : ((typeof args.lang !== 'undefined' && args.lang.trim() ) ? args.lang.trim() : new RegExp(args.lang,'i') ),
        "attribute" : new RegExp(( typeof args.attribute !== 'undefined' ? args.attribute.trim() : args.attribute),'i'),
        "isdel" : false
    };
    }
    // match count
    havingCount =  ((typeof args.count !== 'undefined' && args.count.trim() ) ? args.count.trim() : 0 );

    let result =  await cvproposalcatModel.aggregate([
        { $match : conditions },
        { $group : { _id : { client : "$client", lang : "$lang", attribute : { $toLower: "$attribute" } }, count: { $sum : 1 } } },
        { $match : { count : { $gte : parseInt(havingCount) } } },
        { $project : { _id : 0, client : "$_id.client", lang : "$_id.lang", attribute : "$_id.attribute", count : 1 } },
        { $sort : { count : -1 ,attribute:1} }
       ]);

    return result;



    //return cvproposalcatModel.find(conditions);
}



/**
 * CRUD Operations for CVProposalCategory
 **/
// Resolver function for mutation CVProposalCategoryCRUDOps(input) : String
const CVProposalCategoryCRUDOps = async (args, context, info) =>
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
            //let cvproposalcat = await validateCREATEData(args.cvProposalcat);
            let cvproposalcat = args.cvproposalcat;

           
           // console.log("Process Start (Create CV Proposal Categories) : " + dateFormat(new Date(),'yyyymmdd HHMMss') );
            affectedRecords = await createCVProposalCategories(cvproposalcat); 
           // console.log("Process END (Create CV Proposal Categories)(rows) : ("+affectedRecords+")" + dateFormat(new Date(),'yyyymmdd HHMMss')); 


            /*//Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCVCategory(cvProposalcat);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createCVCategory(cvProposalcat);
            }*/

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            //let cvProposalcat = await validateUPDATEData(args.cvProposalcat);
            let cvproposalcat = args.cvproposalcat;

            // Update candidate data
            affectedRecords = await updateCVProposalCategories(cvproposalcat);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCVCategory(cvProposalcat);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cvProposalcat.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateCVCategory(cvProposalcat);
            }*/

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            //let cvProposalcat = await validateDELETEData(args.cvProposalcat);
            let cvproposalcat = args.cvproposalcat;

            // Logical delete candidate data
            affectedRecords = await logicalDeleteCVProposalCategories(cvproposalcat);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCVCategory(cvProposalcat);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cvProposalcat.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteCVCategory(cvProposalcat);
            }*/

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            //let cvProposalcat = await validateDELETEData(args.cvProposalcat);
            let cvproposalcat = args.cvproposalcat;

            // Physical delete candidate data
            affectedRecords = await physicalDeleteCVProposalCategories(cvproposalcat);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCVCategory(cvProposalcat);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != cvProposalcat.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCVCategory(cvProposalcat);
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


/* // create CV Proposal Categories
const createCVProposalCategories= async (cvproposalcat) =>
{
    try 
    {
        let createCVCategoryJSON;    
        
        for( let i = 0; i < cvproposalcat.length; i++)
        {
            // form the create json object
            createCVCategoryJSON = {
                "client" 		:	cvproposalcat[i].client,
                "lang"		    :	cvproposalcat[i].lang,
                "attribute"	    :	cvproposalcat[i].attribute,
                "cdate"         :   sysdate_yyyymmdd,
                "ctime"         :   systime_hh24mmss,
                "isdel"         :   false
            }
        
            // Instanciate Proposal Category Model                    
            const cvProposalcatModelInst = new cvproposalcatModel(createCVCategoryJSON);
            //console.log(createCVCategoryJSON)
           // fs.appendFile('data.txt', '\n'+JSON.stringify(createCVCategoryJSON), (err) => {  
                // throws an error, you could also catch it here
              //  if (err) throw err;
            
                
            //});
            
        
            // Save the Category record
            let result = await cvProposalcatModelInst.save();
        }           
        
        return cvproposalcat.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}
 */


// create CV Proposal Categories - Updated for Bulk insert
const createCVProposalCategories= async (cvproposalcat) =>
{
    try 
    {
        
        for( let i = 0; i < cvproposalcat.length; i++)
        {
            // add create params
            cvproposalcat[i].cdate = sysdate_yyyymmdd;
            cvproposalcat[i].ctime = systime_hh24mmss;
            cvproposalcat[i].isdel = false;
        }        

        // Bulk insert Proposal Categories
        await cvproposalcatModel.insertMany(cvproposalcat);
        
        return cvproposalcat.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// update CV Proposal Category
const updateCVProposalCategories = async (cvproposalcat) =>
{
    try 
    {
        let updateCVCategoryDataJSON;
        let updateCVCategoryClauseJSON;    
        
        for( let i = 0; i < cvproposalcat.length; i++)
        {
            // form the data json object
            updateCVCategoryDataJSON = {
                "udate"         :   sysdate_yyyymmdd,
                "utime"         :   systime_hh24mmss,
            }

            // form the clause json object
            updateCVCategoryClauseJSON = {
                "client" 		:	cvproposalcat[i].client,
                "lang"		    :	cvproposalcat[i].lang,
                "attribute"	    :	cvproposalcat[i].attribute
            }
            
            // Update Category record
            let result = await cvproposalcatModel.findOneAndUpdate(updateCVCategoryClauseJSON, updateCVCategoryDataJSON, {new : true});    

        }
        
        return cvproposalcat.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// logical delete CV Proposal Categories
const logicalDeleteCVProposalCategories = async (cvproposalcat) =>
{
    try 
    {
        let updateCVCategoryDataJSON;
        let updateCVCategoryClauseJSON;    
        
        for( let i = 0; i < cvproposalcat.length; i++)
        {
            // form the data json object
            updateCVCategoryDataJSON = {
                "ddate"         :   sysdate_yyyymmdd,
                "dtime"         :   systime_hh24mmss,
                "isdel"         :   true
            }

            // form the clause json object
            updateCVCategoryClauseJSON = {
                "client" 		:	cvproposalcat[i].client,
                "lang"		    :	cvproposalcat[i].lang,
                "attribute"	    :	cvproposalcat[i].attribute
            }

            let result = await cvproposalcatModel.findOneAndUpdate(updateCVCategoryClauseJSON, updateCVCategoryDataJSON, {new : true});    

        }
        
        return cvproposalcat.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// physical delete CV Proposal Categories
const physicalDeleteCVProposalCategories = async (cvproposalcat) =>
{
    try 
    {
        let deleteCVCategoryClauseJSON;    
        
        for( let i = 0; i < cvproposalcat.length; i++)
        {
            // form the clause json object
            deleteCVCategoryClauseJSON = {
                "client" 		:	cvproposalcat[i].client,
                "lang"		    :	cvproposalcat[i].lang,
                "attribute"	    :	cvproposalcat[i].attribute
            }

            let result = await cvproposalcatModel.findOneAndRemove(deleteCVCategoryClauseJSON);    

        }
        
        return cvproposalcat.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// Export function modules
module.exports = {
   searchProposalCategories,
   CVProposalCategoryCRUDOps
};