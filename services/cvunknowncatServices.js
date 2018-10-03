// import section
import connection from "../config/db/dbConnect";
import {cvunknowncatModel,cvignorecatModel } from "../models/mongoose";
import math from 'mathjs';
import validations from '../common/validations';
import cvcategoryServices from './cvcategoryServices.js'

//Import the date format module
import dateFormat from 'dateformat';
var now = new Date();
var sysdate_yyyymmdd = dateFormat(new Date(),'yyyymmdd');
var systime_hh24mmss = dateFormat(new Date(),'HHMMss');



// Resolver function for query searchUnknownCategories({input}) : [CVUnknownCategories]
const searchUnknownCategories = async (args, context, info) =>
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

    // condition object
    conditions = {
        "client" : ((typeof args.client !== 'undefined' && args.client.trim() ) ? args.client.trim() : new RegExp(args.client,'i') ),
        "lang" : ((typeof args.lang !== 'undefined' && args.lang.trim() ) ? args.lang.trim() : new RegExp(args.lang,'i') ),
        "attribute" : new RegExp(( typeof args.attribute !== 'undefined' ? args.attribute.trim() : args.attribute),'i'),
        "isdel" : false
    };
    }
    // match count
    havingCount =  ((typeof args.count !== 'undefined' && args.count.trim() ) ? args.count.trim() : 0 );

    //return cvunknowncatModel.find(conditions);

    /* Query Structure =>
        $match : Where clause
        $group : Group By clause
        $match : Having clause
        $project : Select clause    0 : No Selection,       1 : Selection
        $sort : Order By clause     1 : Ascending order,    -1 : Descending order
     */
    let result =  await cvunknowncatModel.aggregate([
        { $match : conditions },
        { $group : { _id : { client : "$client", lang : "$lang", attribute : "$attribute"}, count: { $sum : 1 } } },
        { $match : { count : { $gte : parseInt(havingCount) } } },
        { $project : { _id : 0, client : "$_id.client", lang : "$_id.lang", attribute : "$_id.attribute", count : 1 } },
        { $sort : { attribute : 1 } }
       ]);

    return result;

}



/**
 * CRUD Operations for CVUnknownCategory
 **/
// Resolver function for mutation CVUnknownCategoryCRUDOps(input) : String
const CVUnknownCategoryCRUDOps = async (args, context, info) =>
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
            //let cvunknowncat = await validateCREATEData(args.cvunknowncat);
            let cvunknowncat = args.cvunknowncat;
           // console.log("Process Start (Create CV unknown Categories) : " +  dateFormat(new Date(),'yyyymmdd HHMMss') ); 
            affectedRecords = await createCVUnknownCategories(cvunknowncat);
           // console.log("Process END   (Create CV unknown Categories)(rows) : ("+affectedRecords+")" + dateFormat(new Date(),'yyyymmdd HHMMss') ); 
            /*//Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCVCategory(cvunknowncat);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createCVCategory(cvunknowncat);
            }*/

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            //let cvunknowncat = await validateUPDATEData(args.cvunknowncat);
            let cvunknowncat = args.cvunknowncat;

            // Update candidate data
            affectedRecords = await updateCVUnknownCategories(cvunknowncat);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCVCategory(cvunknowncat);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cvunknowncat.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateCVCategory(cvunknowncat);
            }*/

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            //let cvunknowncat = await validateDELETEData(args.cvunknowncat);
            let cvunknowncat = args.cvunknowncat;

            // Logical delete candidate data
            affectedRecords = await logicalDeleteCVUnknownCategories(cvunknowncat);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCVCategory(cvunknowncat);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cvunknowncat.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteCVCategory(cvunknowncat);
            }*/

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            //let cvunknowncat = await validateDELETEData(args.cvunknowncat);
            let cvunknowncat = args.cvunknowncat;

            // Physical delete candidate data
            affectedRecords = await physicalDeleteAllCVUnknownCategories(cvunknowncat);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCVCategory(cvunknowncat);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != cvunknowncat.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCVCategory(cvunknowncat);
            }*/

        }else if(transaction == "PHYSICAL_DELETE_IGNORE")   // Physical delete
        {

            // Validate input data
            //let cvunknowncat = await validateDELETEData(args.cvunknowncat);
            let cvunknowncat = args.cvunknowncat;

            // Physical delete candidate data
            affectedRecords = await physicalDeleteAllCVIgnoreCategories(cvunknowncat);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCVCategory(cvunknowncat);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != cvunknowncat.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCVCategory(cvunknowncat);
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


/* // create CV Unknown Categories
const createCVUnknownCategories= async (cvunknowncat) =>
{
    try 
    {
        let createCVCategoryJSON;    
        
        for( let i = 0; i < cvunknowncat.length; i++)
        {
            // form the create json object
            createCVCategoryJSON = {
                "client" 		:	cvunknowncat[i].client,
                "lang"		    :	cvunknowncat[i].lang,
                "attribute"	    :	cvunknowncat[i].attribute,
                "cdate"         :   sysdate_yyyymmdd,
                "ctime"         :   systime_hh24mmss,
                "isdel"         :   false
            }
        
            // Instanciate Unknown Category Model                    
            const cvunknowncatModelInst = new cvunknowncatModel(createCVCategoryJSON);
        
            // Save the Category record
            let result = await cvunknowncatModelInst.save();
        }           
        
        return cvunknowncat.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}
 */


// create CV Unknown Categories - Updated for Bulk insert
const createCVUnknownCategories= async (cvunknowncat) =>
{
    try 
    {
        
        for( let i = 0; i < cvunknowncat.length; i++)
        {
            // add create params
            cvunknowncat[i].cdate = sysdate_yyyymmdd;
            cvunknowncat[i].ctime = systime_hh24mmss;
            cvunknowncat[i].isdel = false;
        
        }           
 
        // Bulk insert Unknown Categories
        await cvunknowncatModel.insertMany(cvunknowncat);
        
        return cvunknowncat.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// update CV Unknown Category
const updateCVUnknownCategories = async (cvunknowncat) =>
{
    try 
    {
        let updateCVCategoryDataJSON;
        let updateCVCategoryClauseJSON;    
        
        for( let i = 0; i < cvunknowncat.length; i++)
        {
            // form the data json object
            updateCVCategoryDataJSON = {
                "udate"         :   sysdate_yyyymmdd,
                "utime"         :   systime_hh24mmss,
            }

            // form the clause json object
            updateCVCategoryClauseJSON = {
                "client" 		:	cvunknowncat[i].client,
                "lang"		    :	cvunknowncat[i].lang,
                "attribute"	    :	cvunknowncat[i].attribute
            }
            
            // Update Category record
            let result = await cvunknowncatModel.findOneAndUpdate(updateCVCategoryClauseJSON, updateCVCategoryDataJSON, {new : true});    

        }
        
        return cvunknowncat.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// logical delete CV Unknown Categories
const logicalDeleteCVUnknownCategories = async (cvunknowncat) =>
{
    try 
    {
        let updateCVCategoryDataJSON;
        let updateCVCategoryClauseJSON;    
        
        for( let i = 0; i < cvunknowncat.length; i++)
        {
            // form the data json object
            updateCVCategoryDataJSON = {
                "ddate"         :   sysdate_yyyymmdd,
                "dtime"         :   systime_hh24mmss,
                "isdel"         :   true
            }

            // form the clause json object
            updateCVCategoryClauseJSON = {
                "client" 		:	cvunknowncat[i].client,
                "lang"		    :	cvunknowncat[i].lang,
                "attribute"	    :	cvunknowncat[i].attribute
            }

            let result = await cvunknowncatModel.findOneAndUpdate(updateCVCategoryClauseJSON, updateCVCategoryDataJSON, {new : true});    

        }
        
        return cvunknowncat.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// physical delete CV Unknown Categories
const physicalDeleteCVUnknownCategories = async (cvunknowncat) =>
{
    try 
    {
        let deleteCVCategoryClauseJSON;    
        
        for( let i = 0; i < cvunknowncat.length; i++)
        {
            // form the clause json object
            deleteCVCategoryClauseJSON = {
                "client" 		:	cvunknowncat[i].client,
                "lang"		    :	cvunknowncat[i].lang,
                "attribute"	    :	cvunknowncat[i].attribute
            }

            let result = await cvunknowncatModel.findOneAndRemove(deleteCVCategoryClauseJSON);    

        }
        
        return cvunknowncat.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}

// Resolver function for query searchCategories({input}) : [Category]
const searchIgnoreCategories = async (args, context, info) =>
{
    let exactMatch = args.exactMatch;
    let conditions;
    //let exactMatch =args.exactMatch

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

    /*console.log("\nconditions => ");
    console.log(conditions);  */

    return cvignorecatModel.find(conditions);

}
const CVProcessUnknownCategory = async (args, context, info) =>
{
    try {

        let transaction = args.transaction;

        let affectedRecords = 0;
        let affectedRecord = '';
        // If transaction is not available
        if(typeof transaction === 'undefined' || transaction.trim().length == 0)
            throw new Error("Transaction is required and can not be empty.");

        transaction = transaction.trim().toUpperCase(); 
        if(transaction == "PROCESS")
        {
            let cvunknowncats=args.cvunknowncat
            let knownCategory=[];
            let ignoreCategory=[];

            for( var i in cvunknowncats)
            {
                var unknowndoc = cvunknowncats[i];
                if(unknowndoc.category==='Ignore'){
                    ignoreCategory.push(unknowndoc)
                }
                else{
                    knownCategory.push(unknowndoc)
                }

            }

           let ignore= createCVIgnoreCategories(ignoreCategory)
           
           let known =cvcategoryServices.createCVCategories(knownCategory)
           physicalDeleteAllCVIgnoreCategories(knownCategory)
           let removed= physicalDeleteAllCVUnknownCategories(cvunknowncats)

           affectedRecord =new Promise(function(resolve,reject){
            let output=''
            ignore.then(res=>{
                             output=output+' Ignore '+res
                             known.then(res1=>{
                                output=output+' Known '+res1
                                removed.then(res2=>{
                                    output=output+' Removed '+res2 
                                    resolve(output) 
                                })

                             })
                                 
                            }
              
                )


           })

          



        }

        return affectedRecord
        
        
    } catch (error) {
        return error; 
    }


}
// physical delete CV Unknown Categories
const physicalDeleteAllCVUnknownCategories = async (cvunknowncat) =>
{
    try 
    {
        let deleteCVCategoryClauseJSON;    
        
        for( let i = 0; i < cvunknowncat.length; i++)
        {
            // form the clause json object
            deleteCVCategoryClauseJSON = {
                "client" 		:	cvunknowncat[i].client,
                "lang"		    :	cvunknowncat[i].lang,
                "attribute"	    :	cvunknowncat[i].attribute
            }
            
            
            let result = await cvunknowncatModel.remove(deleteCVCategoryClauseJSON);    

        }
        
        return cvunknowncat.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}

// physical delete CV Unknown Categories
const physicalDeleteAllCVIgnoreCategories = async (cvignorecat) =>
{
    try 
    {
        let deleteCVCategoryClauseJSON;    
        
        for( let i = 0; i < cvignorecat.length; i++)
        {
            // form the clause json object
            deleteCVCategoryClauseJSON = {
                "client" 		:	cvignorecat[i].client,
                "lang"		    :	cvignorecat[i].lang,
                "attribute"	    :	cvignorecat[i].attribute
            }
            
            
            let result = await cvignorecatModel.remove(deleteCVCategoryClauseJSON);    

        }
        
        return cvignorecat.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}

// create CV Ignore Categories
const createCVIgnoreCategories= async (cvignorecat) =>
{
    try 
    {
        let createCVCategoryJSON;    
        
        for( let i = 0; i < cvignorecat.length; i++)
        {
            // form the create json object
            createCVCategoryJSON = {
                "client" 		:	cvignorecat[i].client,
                "lang"		    :	cvignorecat[i].lang,
                "attribute"	    :	cvignorecat[i].attribute,
                "cdate"         :   sysdate_yyyymmdd,
                "ctime"         :   systime_hh24mmss,
                "isdel"         :   false
            }
        
            // Instanciate Unknown Category Model                    
            const cvignorecatModelInst = new cvignorecatModel(createCVCategoryJSON);
        
            // Save the Category record
            let result = await cvignorecatModelInst.save();
        }           
        
        return cvignorecat.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// Export function modules
module.exports = {
   searchUnknownCategories,
   searchIgnoreCategories,
   CVUnknownCategoryCRUDOps,
   CVProcessUnknownCategory
};