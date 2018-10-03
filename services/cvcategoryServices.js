// import section
import connection from "../config/db/dbConnect";
import {cvcategoryModel} from "../models/mongoose";
import math from 'mathjs';
import validations from '../common/validations';

//Import the date format module
import dateFormat from 'dateformat';
var now = new Date();
var sysdate_yyyymmdd = dateFormat(now,'yyyymmdd');
var systime_hh24mmss = dateFormat(now,'HHMMss');



// Resolver function for query searchCategories({input}) : [Category]
const searchCategories = async (args, context, info) =>
{
    let exactMatch =args.exactMatch
    let conditions;

    if(exactMatch){
        conditions = {
            "client" : ((typeof args.client !== 'undefined' && args.client.trim() ) ? args.client.trim() : new RegExp(args.client,'i') ),
            "lang" : ((typeof args.lang !== 'undefined' && args.lang.trim() ) ? args.lang.trim() : new RegExp(args.lang,'i') ),
            "category" :  new RegExp(( typeof args.category !== 'undefined' ? args.category.trim() : args.category),'i'),
            "attribute" : new RegExp('^'+( typeof args.attribute !== 'undefined' ? args.attribute.trim() : args.attribute)+'$','i'),      
            "inference" : new RegExp(( typeof args.inference !== 'undefined' ? args.inference.trim() : args.inference),'i'),
            "isdel" : false
        };

    }else{

    conditions = {
        "client" : ((typeof args.client !== 'undefined' && args.client.trim() ) ? args.client.trim() : new RegExp(args.client,'i') ),
        "lang" : ((typeof args.lang !== 'undefined' && args.lang.trim() ) ? args.lang.trim() : new RegExp(args.lang,'i') ),
        "category" : new RegExp(( typeof args.category !== 'undefined' ? args.category.trim() : args.category),'i'),
        "attribute" : new RegExp(( typeof args.attribute !== 'undefined' ? args.attribute.trim() : args.attribute),'i'),
        "inference" : new RegExp(( typeof args.inference !== 'undefined' ? args.inference.trim() : args.inference),'i'),
        "isdel" : false
    };
}

    /*console.log("\nconditions => ");
    console.log(conditions);  */

    return cvcategoryModel.find(conditions);

}



/**
 * CRUD Operations for CVCategory
 **/
// Resolver function for mutation CVCategoryCRUDOps(input) : String
const CVCategoryCRUDOps = async (args, context, info) =>
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
            //let cvcategories = await validateCREATEData(args.cvcategories);
            let cvcategories = args.cvcategories;
           // console.log("Process Start (Create CV Categories) : " + sysdate_yyyymmdd + " " + systime_hh24mmss );
            affectedRecords = await createCVCategories(cvcategories); 
           // console.log("Process END (Create CV Categories)(rows) : ("+affectedRecords+")" + sysdate_yyyymmdd + " " + systime_hh24mmss ); 

            

            /*//Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCVCategory(cvcategories);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createCVCategory(cvcategories);
            }*/

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            //let cvcategories = await validateUPDATEData(args.cvcategories);
            let cvcategories = args.cvcategories;

            // Update candidate data
            affectedRecords = await updateCVCategories(cvcategories);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCVCategory(cvcategories);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cvcategories.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateCVCategory(cvcategories);
            }*/

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            //let cvcategories = await validateDELETEData(args.cvcategories);
            let cvcategories = args.cvcategories;

            // Logical delete candidate data
            affectedRecords = await logicalDeleteCVCategories(cvcategories);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCVCategory(cvcategories);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cvcategories.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteCVCategory(cvcategories);
            }*/

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            //let cvcategories = await validateDELETEData(args.cvcategories);
            let cvcategories = args.cvcategories;

            // Physical delete candidate data
            affectedRecords = await physicalDeleteCVCategories(cvcategories);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCVCategory(cvcategories);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != cvcategories.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCVCategory(cvcategories);
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


// create CV Categories
const createCVCategories = async (cvcategories) =>
{
    try 
    {
        let createCVCategoryJSON; 
         
        
        for( let i = 0; i < cvcategories.length; i++)
        {
            // form the create json object
            createCVCategoryJSON = {
                "client" 		:	cvcategories[i].client,
                "lang"		    :	cvcategories[i].lang,
                "category"	    :	cvcategories[i].category,
                "attribute"	    :	cvcategories[i].attribute,
                "inference"		:	cvcategories[i].inference,
                "cdate"         :   sysdate_yyyymmdd,
                "ctime"         :   systime_hh24mmss,
                "isdel"         :   false
            }
        
            // Instanciate Category Model                    
            const cvcategoryModelInst = new cvcategoryModel(createCVCategoryJSON);
        
            // Save the Category record
            let result = await cvcategoryModelInst.save();
        }           
          
        
        return cvcategories.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// update CV Category
const updateCVCategories = async (cvcategories) =>
{
    try 
    {
        let updateCVCategoryDataJSON;
        let updateCVCategoryClauseJSON;    
        
        for( let i = 0; i < cvcategories.length; i++)
        {
            // form the data json object
            updateCVCategoryDataJSON = {
                "inference"		:	cvcategories[i].inference,
                "udate"         :   sysdate_yyyymmdd,
                "utime"         :   systime_hh24mmss,
            }

            // form the clause json object
            updateCVCategoryClauseJSON = {
                "client" 		:	cvcategories[i].client,
                "lang"		    :	cvcategories[i].lang,
                "category"	    :	cvcategories[i].category,
                "attribute"	    :	cvcategories[i].attribute
            }
            
            // Update Category record
            let result = await cvcategoryModel.findOneAndUpdate(updateCVCategoryClauseJSON, updateCVCategoryDataJSON, {new : true});    

        }
        
        return cvcategories.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// logical delete CV Categories
const logicalDeleteCVCategories = async (cvcategories) =>
{
    try 
    {
        let updateCVCategoryDataJSON;
        let updateCVCategoryClauseJSON;    
        
        for( let i = 0; i < cvcategories.length; i++)
        {
            // form the data json object
            updateCVCategoryDataJSON = {
                "ddate"         :   sysdate_yyyymmdd,
                "dtime"         :   systime_hh24mmss,
                "isdel"         :   true
            }

            // form the clause json object
            updateCVCategoryClauseJSON = {
                "client" 		:	cvcategories[i].client,
                "lang"		    :	cvcategories[i].lang,
                "category"	    :	cvcategories[i].category,
                "attribute"	    :	cvcategories[i].attribute
            }

            let result = await cvcategoryModel.findOneAndUpdate(updateCVCategoryClauseJSON, updateCVCategoryDataJSON, {new : true});    

        }
        
        return cvcategories.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// physical delete CV Categories
const physicalDeleteCVCategories = async (cvcategories) =>
{
    try 
    {
        let deleteCVCategoryClauseJSON;    
        
        for( let i = 0; i < cvcategories.length; i++)
        {
            // form the clause json object
            deleteCVCategoryClauseJSON = {
                "client" 		:	cvcategories[i].client,
                "lang"		    :	cvcategories[i].lang,
                "category"	    :	cvcategories[i].category,
                "attribute"	    :	cvcategories[i].attribute
            }

            let result = await cvcategoryModel.findOneAndRemove(deleteCVCategoryClauseJSON);    

        }
        
        return cvcategories.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// Export function modules
module.exports = {
   searchCategories,
   CVCategoryCRUDOps,
   createCVCategories
};