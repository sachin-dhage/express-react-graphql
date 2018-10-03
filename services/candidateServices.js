// import section
import connection from "../config/db/dbConnect";
import {candidateModel, documentModel} from "../models/mongoose";
import math from 'mathjs';
import validations from '../common/validations';
import ratingServices from './ratingServices';
import documentServices from './documentServices';

//Import for text ectraction
import textract from 'textract';
import wordextractor from 'word-extractor';
import pdfextract from 'pdf.js-extract';
import temporary from 'temporary';

//Import the date format module
import dateFormat from 'dateformat';
import { Buffer } from "buffer";
var now = new Date();
var sysdate_yyyymmdd = dateFormat(now,'yyyymmdd');
var systime_hh24mmss = dateFormat(now,'HHMMss');


// Resolver function for query searchCandidates({input}) : [Candidates]
const searchCandidates = async (args, context, info) =>
{
    let exactMatch = args.exactMatch;
    let conditions;


    if(exactMatch)
    {
        conditions = {
            client : ((typeof args.client !== 'undefined' && args.client.trim() ) ? args.client.trim() : new RegExp(args.client,'i') ),
            lang : ((typeof args.lang !== 'undefined' && args.lang.trim() ) ? args.lang.trim() : new RegExp(args.lang,'i') ),
            candidateid : ((typeof args.candidateid !== 'undefined' && args.candidateid.trim() ) ? args.candidateid.trim() : new RegExp(args.candidateid,'i') ),
            firstname : ((typeof args.firstname !== 'undefined' && args.firstname.trim() ) ? args.firstname.trim() : new RegExp(args.firstname,'i') ),
            middlename : ((typeof args.middlename !== 'undefined' && args.middlename.trim() ) ? args.middlename.trim() : new RegExp(args.middlename,'i') ),
            lastname : ((typeof args.lastname !== 'undefined' && args.lastname.trim() ) ? args.lastname.trim() : new RegExp(args.lastname,'i') ),
            emailid : ((typeof args.emailid !== 'undefined' && args.emailid.trim() ) ? args.emailid.trim() : new RegExp(args.emailid,'i') ),
            mobileno : ((typeof args.mobileno !== 'undefined' && args.mobileno.trim() ) ? args.mobileno.trim() : new RegExp(args.mobileno,'i') ),
            idprooftype : ((typeof args.idprooftype !== 'undefined' && args.idprooftype.trim() ) ? args.idprooftype.trim() : new RegExp(args.idprooftype,'i') ),            
            idproofno : ((typeof args.idproofno !== 'undefined' && args.idproofno.trim() ) ? args.idproofno.trim() : new RegExp(args.idproofno,'i') ),
            experience : ((typeof args.experience !== 'undefined' && args.experience.trim() ) ? args.experience.trim() : new RegExp(args.experience,'i') ),
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
            candidateid : new RegExp(( typeof args.candidateid !== 'undefined' ? args.candidateid.trim() : args.candidateid),'i'),
            firstname : new RegExp(( typeof args.firstname !== 'undefined' ? args.firstname.trim() : args.firstname),'i'),
            middlename : new RegExp(( typeof args.middlename !== 'undefined' ? args.middlename.trim() : args.middlename),'i'),
            lastname : new RegExp(( typeof args.lastname !== 'undefined' ? args.lastname.trim() : args.lastname),'i'),
            emailid : new RegExp(( typeof args.emailid !== 'undefined' ? args.emailid.trim() : args.emailid),'i'),
            mobileno : new RegExp(( typeof args.mobileno !== 'undefined' ? args.mobileno.trim() : args.mobileno),'i'),
            idprooftype : ((typeof args.idprooftype !== 'undefined' && args.idprooftype.trim() ) ? args.idprooftype.trim() : new RegExp(args.idprooftype,'i') ),
            idproofno : new RegExp(( typeof args.idproofno !== 'undefined' ? args.idproofno.trim() : args.idproofno),'i'),
            experience : new RegExp(( typeof args.experience !== 'undefined' ? args.experience.trim() : args.experience),'i'),
            country : ((typeof args.country !== 'undefined' && args.country.trim() ) ? args.country.trim() : new RegExp(args.country,'i') ),
            technology : new RegExp(( typeof args.technology !== 'undefined' ? args.technology.trim() : args.technology),'i'),
            isdel : false
        };
    }

    /* console.log("\nconditions => ");
    console.log(conditions); */  

    //return candidateModel.find(conditions);
    let result =  await candidateModel.aggregate([
        { $match: conditions },
        {
            $lookup:
            {
                from : "Ratings",
                localField : "candidateid",
                foreignField : "candidateid",
                as : "Ratings"
            }
        },
        {
            $lookup:
            {
                from : "Documents",
                localField : "candidateid",
                foreignField : "candidateid",
                as : "Documents"
            }
        },
        {
            $project : 
            {
                "client" 		:	1,
                "lang"		    :	1,
                "candidateid"	: 	1,
                "firstname"	    :	1,
                "middlename"	:	1,
                "lastname"	    :	1,
                "emailid"		:	1,
                "mobileno"	    :	1,
                "idprooftype"	:	1,
                "idproofno"	    :	1,
                "experience"	:	1,
                "country"		:	1,
                "technology"	:	1,
                "ratings"       :   { 
                                        $filter: 
                                        {
                                            input : "$Ratings", 
                                            as : "rating", 
                                            cond : { $eq: ["$$rating.isdel", false]}
                                        }
                                    },
                "document"      :   { 
                                        $filter: 
                                        {
                                            input : "$Documents" , 
                                            as : "document", 
                                            cond : { $eq: ["$$document.isdel", false]}
                                        }
                                    }
            }
        },
        { $sort : {  firstname : 1, lastname : 1}}
    ]);

    //console.log("result => ");  console.log(result);
    return result;

}



// Resolver function for query candidateCV({input}) : [CandidateCV]
const candidateCV = async (args, context, info) =>
{
    /*let conditions = {
            client : ((typeof args.client !== 'undefined' && args.client.trim() ) ? args.client.trim() : new RegExp(args.client,'i') ),
            lang : ((typeof args.lang !== 'undefined' && args.lang.trim() ) ? args.lang.trim() : new RegExp(args.lang,'i') ),
            candidateid : ((typeof args.candidateid !== 'undefined' && args.candidateid.trim() ) ? args.candidateid.trim() : new RegExp(args.candidateid,'i') ),
            isdel : false
        };

     console.log("\nconditions => ");
    console.log(conditions);  */ 

    //return candidateModel.find(conditions);
/*     let result =  await candidateModel.aggregate([
        { $match: conditions },
        {
            $lookup:
            {
                from : "Documents",
                localField : "candidateid",
                foreignField : "candidateid",
                as : "Documents"
            }
        },
        {
            $project : 
            {
                "client" 		:	1,
                "lang"		    :	1,
                "candidateid"	: 	1,
                "firstname"	    :	1,
                "middlename"	:	1,
                "lastname"	    :	1,
                "emailid"		:	1,
                "mobileno"	    :	1,
                "idprooftype"	:	1,
                "idproofno"	    :	1,
                "experience"	:	1,
                "country"		:	1,
                "technology"	:	1,
                "document"      :   { 
                                        $filter: 
                                        {
                                            input : "$Documents" , 
                                            as : "document", 
                                            cond : { $eq: ["$$document.isdel", false]}
                                        }
                                    }
            }
        }
    ]);
 */

    let conditions = {
        client : ((typeof args.client !== 'undefined' && args.client.trim() ) ? args.client.trim() : new RegExp(args.client,'i') ),
        lang : ((typeof args.lang !== 'undefined' && args.lang.trim() ) ? args.lang.trim() : new RegExp(args.lang,'i') ),
        candidateid : ((typeof args.candidateid !== 'undefined' && args.candidateid.trim() ) ? args.candidateid.trim() : new RegExp(args.candidateid,'i') ),
        documentid : ((typeof args.documentid !== 'undefined' && args.documentid.trim() ) ? args.documentid.trim() : new RegExp(args.documentid,'i') ),
        isdel : false
    };


    let result =  await documentModel.aggregate([
        { $match: conditions }
    ]);


    // Extract the text from Binary Buffer
    if(result.length !=0 )
    result = await new Promise((resolve, reject) => 
            {
                extractText(result, function(error, data)
                {
                    if(error)
                        reject(error);
                    else
                        resolve(data);
                });     
            });

    //console.log("result => "); 
    //console.log(result);

    return result;

}

// Function for Text Extraction
async function extractText(result, callback)
{    

    let docName = result[0].documentname;
    let mimeType = result[0].documenttype;      
    let docBuffer = result[0].document.buffer;

    //console.log(mimeType);  console.log("--------------");
    //console.log(docBuffer);    console.log("--------------");
    //console.log("result =>");    console.log(result);    
    
    /*------- Block for Extracting Docx File --------*/ 
    if(docName.endsWith(".docx"))
    {
        textract.fromBufferWithMime(mimeType, docBuffer, function (error, text) {
            if(error)   
            {
                console.log(error);
                return callback(error);
            }    
            else
            {
                //console.log("docx contents =>");
                //console.log(text);

                 result[0].document = text;
                 //console.log("result =>");    console.log(result[0].document[0]);    

                 return callback(null,result);
            }
        });
        
    }
    /*------- Block for Extracting PDF File --------*/ 
    else if(docName.endsWith(".pdf"))
    {
        let PDFExtract = pdfextract.PDFExtract;
        let pdfExtract = new PDFExtract();

        let contents='';
        let options = {}; /* options are handed over to pdf.js e.g, { password: 'somepassword' } */
        pdfExtract.extractBuffer(docBuffer, options , function (err, data) {
            if (err)    
            {
                console.log(error);
                return callback(error);
            }    
            else
            {
                let pages = data.pages;
                
                pages.forEach((page)=>
                {
                    let pageContents=page.content;
                
                    pageContents.forEach((pageContent)=>
                    {
                    contents=contents + pageContent.str;
                    })
                    
                });

                //console.log("pdf contents =>"); console.log(contents);

                result[0].document = contents;
                //console.log("result =>");    console.log(result[0].document[0]);    

                //return result;
                return callback(null,result);

            }
        });

    }
    /*------- Block for Extracting Doc File --------*/ 
    else if(docName.endsWith(".doc"))
    {
        /*let extractor = new wordextractor();
        let extracted = extractor.extract(docBuffer);
        
        extracted.then(function(doc) {
        wordData=doc.getBody()
        console.log("doc contents =>");
        console.log(wordData);
        });*/
        //return callback(new Error("No parser found for .doc file."));

        /* 
            Workaround:  1. Create temporary file from buffer 
                         2. Read temporary file
                         3. Delete temporary file
        */

        // Create temporary file
        let tempFile = new temporary.File();

        // Write Binary Buffer to Temporary File
        tempFile.writeFileSync(docBuffer);

        //console.log("file.path => "); console.log(file.path); // path.

        let extractor = new wordextractor();

        // Read the temporary file
        let extracted = extractor.extract(tempFile.path);
        
        extracted.then(function(doc) {
            try
            {
                let wordData = doc.getBody()
                //console.log("doc contents =>");
                //console.log(wordData);
                
                result[0].document = wordData;
                //console.log("result =>");    console.log(result[0].document[0]);    

                // Remove the temporary file
                tempFile.unlinkSync();

                return callback(null,result);

            }
            catch(error)
            {
                console.log(error);
                return callback(error);
            }    
        });

    }
    else if(docName.endsWith(".txt"))
    {
        //console.log("text contents => ");    
        //console.log(docBuffer.toString());

        result[0].document = docBuffer.toString();
        //console.log("result =>");    console.log(result[0].document[0]);    

        //return result;
        return callback(null,result);

    }
    else
    {
        return callback(new Error("Unsupported CV format found."));
    }


}



/**
 * CRUD Operations for Candidates
 **/
// Resolver function for mutation CandidatesCRUDOps(input) : String
const CandidatesCRUDOps = async (args, context, info) =>
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
            let candidates = await validateCREATEData(args.candidates);

            affectedRecords = await createCandidates(candidates, context);

            /*//Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCandidates(candidates);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createCandidates(candidates);
            }*/

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let candidates = await validateUPDATEData(args.candidates);

            // Update candidate data
            affectedRecords = await updateCandidates(candidates, context);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCandidates(candidates);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != candidates.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateCandidates(candidates);
            }*/

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let candidates = await validateDELETEData(args.candidates);

            // Logical delete candidate data
            affectedRecords = await logicalDeleteCandidates(candidates);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCandidates(candidates);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != candidates.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteCandidates(candidates);
            }*/

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let candidates = await validateDELETEData(args.candidates);

            // Physical delete candidate data
            affectedRecords = await physicalDeleteCandidates(candidates);

            /*// Check availability of records
            let duplicateObj =  await checkDuplicateCandidates(candidates);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != candidates.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCandidates(candidates);
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
const validateCREATEData = async (candidates) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < candidates.length; i++)
        {
            let validationObject = {};

            validations.checkNull("client", candidates[i].client, "Client is required", validationObject);
            validations.checkNull("lang", candidates[i].lang, "Language is required", validationObject);

            validations.checkNull("candidateid", candidates[i].candidateid, "Candidate ID is required", validationObject);

            validations.checkNull("firstname", candidates[i].firstname, "First name is required", validationObject);
            validations.checkNull("lastname", candidates[i].lastname, "Last name is required", validationObject);
            validations.checkNull("emailid", candidates[i].emailid, "Email id is required", validationObject);
            validations.checkNull("mobileno", candidates[i].mobileno, "Mobile number is required", validationObject);
            validations.checkNull("idprooftype", candidates[i].idprooftype, "Identity proof is required", validationObject);
            validations.checkNull("idproofno", candidates[i].idproofno, "ID number is required", validationObject);
            validations.checkNull("experience", candidates[i].experience, "Experience is required", validationObject);
            validations.checkNull("technology", candidates[i].technology, "Technology is required", validationObject);
            validations.checkNull("password", candidates[i].password, "Password is required", validationObject);

            validations.checkMaxLength("firstname", candidates[i].firstname, 100, "Length of First name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("lastname", candidates[i].lastname, 100, "Length of Last name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("middlename", candidates[i].middlename, 100, "Length of Middle name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("emailid", candidates[i].emailid, 100, "Length of Email id should be less than or equal to 100characters", validationObject);
            validations.checkMaxLength("mobileno", candidates[i].mobileno, 10, "Length of mobile no should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("idprooftype", candidates[i].idprooftype, 50, "Length of ID proof type should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("idproofno", candidates[i].idproofno, 50, "Length of ID no should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("experience", candidates[i].experience, 10, "Length of Experience should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("country", candidates[i].country, 50, "Length of Country should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("technology", candidates[i].technology, 1000, "Length of Technology should be less than or equal to 1000 characters", validationObject);

            validations.checkEmail("emailid", candidates[i].emailid, "Email id is not valid", validationObject);
            
            validations.checkNumber("mobileno", candidates[i].mobileno, "Mobile number should be a number", validationObject);
            validations.checkNumber("experience", candidates[i].experience, "Experience should be a number", validationObject);
            
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
            let candidateID;
    
            // Get system date and time
            let curDate = sysdate_yyyymmdd;
            let curTime = systime_hh24mmss;
            
            for(let i = 0; i < candidates.length; i++)
            {
                // Get auto-generated number for candidates id
                //nextNumber = await numberSeries.getNextSeriesNumber(candidates[i].CLNT, "NA", "CNTID");
                //candidateID = sysdate_yyyymmdd + systime_hh24mmss + math.randomInt(101, 999);
                
                // Add auto-generated number as candidates id
                //candidates[i].candidateid = candidateID;

                // Add create params
                candidates[i].cdate = curDate;
                candidates[i].ctime = curTime;
                candidates[i].isdel = false;
                
            }
        
            return candidates;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for update
const validateUPDATEData = async (candidates) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < candidates.length; i++)
        {
            let validationObject = {};

            validations.checkNull("client", candidates[i].client, "Client is required", validationObject);
            validations.checkNull("lang", candidates[i].lang, "Language is required", validationObject);
            validations.checkNull("candidateid", candidates[i].candidateid, "Candidate id is required", validationObject);

            validations.checkNull("firstname", candidates[i].firstname, "First name is required", validationObject);
            validations.checkNull("lastname", candidates[i].lastname, "Last name is required", validationObject);
            validations.checkNull("emailid", candidates[i].emailid, "Email id is required", validationObject);
            validations.checkNull("mobileno", candidates[i].mobileno, "Mobile number is required", validationObject);
            validations.checkNull("idprooftype", candidates[i].idprooftype, "Identity proof is required", validationObject);
            validations.checkNull("idproofno", candidates[i].idproofno, "ID number is required", validationObject);
            validations.checkNull("experience", candidates[i].experience, "Experience is required", validationObject);
            validations.checkNull("technology", candidates[i].technology, "Technology is required", validationObject);
            //validations.checkNull("password", candidates[i].password, "Password is required", validationObject);

            validations.checkMaxLength("firstname", candidates[i].firstname, 100, "Length of First name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("lastname", candidates[i].lastname, 100, "Length of Last name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("middlename", candidates[i].middlename, 100, "Length of Middle name should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("emailid", candidates[i].emailid, 100, "Length of Email id should be less than or equal to 100characters", validationObject);
            validations.checkMaxLength("mobileno", candidates[i].mobileno, 10, "Length of mobile no should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("idprooftype", candidates[i].idprooftype, 50, "Length of ID proof type should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("idproofno", candidates[i].idproofno, 50, "Length of ID no should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("experience", candidates[i].experience, 10, "Length of Experience should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("country", candidates[i].country, 50, "Length of Country should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("technology", candidates[i].technology, 1000, "Length of Technology should be less than or equal to 1000 characters", validationObject);

            validations.checkEmail("emailid", candidates[i].emailid, "Email id is not valid", validationObject);
            
            validations.checkNumber("mobileno", candidates[i].mobileno, "Mobile number should be a number", validationObject);
            validations.checkNumber("experience", candidates[i].experience, "Experience should be a number", validationObject);
            
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
            
            for(let i = 0; i < candidates.length; i++)
            {
                // Add update params
                candidates[i].udate = curDate;
                candidates[i].utime = curTime;
                
            }
        
            return candidates;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}



// Validation funtion for delete
const validateDELETEData = async (candidates) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < candidates.length; i++)
        {
            let validationObject = {};

            validations.checkNull("client", candidates[i].client, "Client is required", validationObject);
            validations.checkNull("lang", candidates[i].lang, "Language is required", validationObject);
            validations.checkNull("candidateid", candidates[i].candidateid, "Candidate id is required", validationObject);

            
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
            
            for(let i = 0; i < candidates.length; i++)
            {
                // Add update params
                candidates[i].ddate = curDate;
                candidates[i].dtime = curTime;
                candidates[i].isdel = true;
                
            }
        
            return candidates;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}



// create candidates
const createCandidates = async (candidates, context) =>
{
    try 
    {
        let createCandidateJSON;    
        
        for( let i = 0; i < candidates.length; i++)
        {
            // form the create json object
            createCandidateJSON = {
                "client" 		:	candidates[i].client,
                "lang"		    :	candidates[i].lang,
                "candidateid"	: 	candidates[i].candidateid,
                "firstname"	    :	candidates[i].firstname,
                "middlename"	:	candidates[i].middlename,
                "lastname"	    :	candidates[i].lastname,
                "emailid"		:	candidates[i].emailid,
                "password"		:	candidates[i].password,
                "mobileno"	    :	candidates[i].mobileno,
                "idprooftype"	:	candidates[i].idprooftype,
                "idproofno"	    :	candidates[i].idproofno,
                "experience"	:	candidates[i].experience,
                "country"		:	candidates[i].country,
                "technology"	:	candidates[i].technology,
                "cdate"         :   candidates[i].cdate,
                "ctime"         :   candidates[i].ctime,
                "isdel"         :   candidates[i].isdel
            }
        
            // Instanciate Candidate Model                    
            const candidateModelInst = new candidateModel(createCandidateJSON);
        
            // Save the candidate record
            let result = await candidateModelInst.save();
           
            /***------------ Ratings Section ------------**/
            // Configure ratings
            let ratings = candidates[i].ratings || [];
            
            if(ratings.length != 0)
            {
                for(let j = 0; j < ratings.length; j++)
                {
                    ratings[j].client = candidates[i].client;
                    ratings[j].lang = candidates[i].lang;
                    ratings[j].candidateid = candidates[i].candidateid;
                }
                
                // Add transaction
                let candidateRatings = {
                    "transaction" : "CREATE",
                    "ratings" : ratings
                }
    
                // Save ratings
                ratingServices.RatingsCRUDOps(candidateRatings)
    
            }

            /***------------ Documents Section ------------**/  

            //documentServices.createDocument(candidates[i], context);
             
        }
        
        return candidates.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// update candidates
const updateCandidates = async (candidates, context) =>
{
    try 
    {
        let updateCandidateDataJSON;
        let updateCandidateClauseJSON;    
        
        for( let i = 0; i < candidates.length; i++)
        {
            // form the data json object
            updateCandidateDataJSON = {
                "firstname"	    :	candidates[i].firstname,
                "middlename"	:	candidates[i].middlename,
                "lastname"	    :	candidates[i].lastname,
                "emailid"		:	candidates[i].emailid,
                "password"		:	candidates[i].password,
                "mobileno"	    :	candidates[i].mobileno,
                "idprooftype"	:	candidates[i].idprooftype,
                "idproofno"	    :	candidates[i].idproofno,
                "experience"	:	candidates[i].experience,
                "country"		:	candidates[i].country,
                "technology"	:	candidates[i].technology,
                "udate"         :   candidates[i].udate,
                "utime"         :   candidates[i].utime
            }

            // form the clause json object
            updateCandidateClauseJSON = {
                "client" 		:	candidates[i].client,
                "lang"		    :	candidates[i].lang,
                "candidateid"	: 	candidates[i].candidateid
            }
            
            // Update candidate record
            let result = await candidateModel.findOneAndUpdate(updateCandidateClauseJSON, updateCandidateDataJSON, {new : true});    

            /***------------ Ratings Section ------------**/
            // Configure ratings for logical delete
            let ratings = [{}];
            
            ratings[0].client = candidates[i].client;
            ratings[0].lang = candidates[i].lang;
            ratings[0].candidateid = candidates[i].candidateid;
            
            // Add transaction
            let candidateRatings = {
                "transaction" : "LOGICAL_DELETE_ALL",
                "ratings" : ratings
            }

            // Logical delete all ratings
            await ratingServices.RatingsCRUDOps(candidateRatings)

            // Configure ratings for creation
            ratings = candidates[i].ratings || [];
            
            if(ratings.length != 0)
            {
                for(let j = 0; j < ratings.length; j++)
                {
                    ratings[j].client = candidates[i].client;
                    ratings[j].lang = candidates[i].lang;
                    ratings[j].candidateid = candidates[i].candidateid;
                }
                
                // Add transaction
                candidateRatings = {
                    "transaction" : "CREATE",
                    "ratings" : ratings
                }
    
                // Save ratings
                ratingServices.RatingsCRUDOps(candidateRatings)
    
            }

            /***------------ Documents Section ------------**/  
            /*let documents = context.files || [];
            if(documents.length !=0 )
            {
                // Remove previous documents
                documentServices.removeDocument(candidates[i], context);

                // Upload new document 
                documentServices.createDocument(candidates[i], context);
            }*/

/*             // Configure ratings
            let ratings = candidates[i].ratings || [];
            
            if(ratings.length != 0 )
            {
                for(let j = 0; j < ratings.length; j++)
                {
                    ratings[j].client = candidates[i].client;
                    ratings[j].lang = candidates[i].lang;
                    ratings[j].candidateid = candidates[i].candidateid;
                }
                
                // Add transaction
                let candidateRatings = {
                    "transaction" : "UPDATE",
                    "ratings" : ratings
                }
    
                // Save ratings
                await ratingServices.RatingsCRUDOps(candidateRatings)
    
            }
 */
        }
        
        return candidates.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// logical delete candidates
const logicalDeleteCandidates = async (candidates) =>
{
    try 
    {
        let updateCandidateDataJSON;
        let updateCandidateClauseJSON;    
        
        for( let i = 0; i < candidates.length; i++)
        {
            // form the data json object
            updateCandidateDataJSON = {
                "ddate"         :   candidates[i].ddate,
                "dtime"         :   candidates[i].dtime,
                "isdel"         :   candidates[i].isdel
            }

            // form the clause json object
            updateCandidateClauseJSON = {
                "client" 		:	candidates[i].client,
                "lang"		    :	candidates[i].lang,
                "candidateid"	: 	candidates[i].candidateid
            }

            let result = await candidateModel.findOneAndUpdate(updateCandidateClauseJSON, updateCandidateDataJSON, {new : true});    

            // Configure ratings
            let ratings = [{}];
            
            ratings[0].client = candidates[i].client;
            ratings[0].lang = candidates[i].lang;
            ratings[0].candidateid = candidates[i].candidateid;
            
            // Add transaction
            let candidateRatings = {
                "transaction" : "LOGICAL_DELETE_ALL",
                "ratings" : ratings
            }

            // Logical delete all ratings
            await ratingServices.RatingsCRUDOps(candidateRatings);

            // Remove documents
            documentServices.removeDocument(candidates[i]);

        }
        
        return candidates.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// physical delete candidates
const physicalDeleteCandidates = async (candidates) =>
{
    try 
    {
        let deleteCandidateClauseJSON;    
        
        for( let i = 0; i < candidates.length; i++)
        {

            // form the clause json object
            deleteCandidateClauseJSON = {
                "client" 		:	candidates[i].client,
                "lang"		    :	candidates[i].lang,
                "candidateid"	: 	candidates[i].candidateid
            }

            let result = await candidateModel.findOneAndRemove(deleteCandidateClauseJSON);    

            // Configure ratings
            let ratings = [{}];
            
            ratings[0].client = candidates[i].client;
            ratings[0].lang = candidates[i].lang;
            ratings[0].candidateid = candidates[i].candidateid;
            
            // Add transaction
            let candidateRatings = {
                "transaction" : "PHYSICAL_DELETE_ALL",
                "ratings" : ratings
            }

            // Physical delete all ratings
            await ratingServices.RatingsCRUDOps(candidateRatings)

        }
        
        return candidates.length;
            
    } 
    catch (error) 
    {
        return error;        
    }

}

// Export function modules
module.exports = {
    searchCandidates,
    candidateCV,
    CandidatesCRUDOps
};