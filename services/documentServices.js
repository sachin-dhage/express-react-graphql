// import section
import connection from "../config/db/dbConnect";
import {documentModel} from "../models/mongoose";
import math from 'mathjs';
import validations from '../common/validations';


//Import the date format module
import dateFormat from 'dateformat';
var now = new Date();
var sysdate_yyyymmdd = dateFormat(now,'yyyymmdd');
var systime_hh24mmss = dateFormat(now,'HHMMss');


// Resolver function for query searchDocuments({input}) : [Document]
const searchDocuments = (args, context, info) =>
{
    let exactMatch = args.exactMatch;
    let conditions;
    
    if(exactMatch)
    {
        conditions = {
            client : ((typeof args.client !== 'undefined' && args.client.trim() ) ? args.client.trim() : new RegExp(args.client,'i') ),
            lang : ((typeof args.lang !== 'undefined' && args.lang.trim() ) ? args.lang.trim() : new RegExp(args.lang,'i') ),
            documentname : ((typeof args.documentname !== 'undefined' && args.documentname.trim() ) ? args.documentname.trim() : new RegExp(args.documentName,'i') ),
            isdel : false
        };

    }
    else
    {
        conditions = {
            client : ((typeof args.client !== 'undefined' && args.client.trim() ) ? args.client.trim() : new RegExp(args.client,'i') ),
            lang : ((typeof args.lang !== 'undefined' && args.lang.trim() ) ? args.lang.trim() : new RegExp(args.lang,'i') ),
            documentname : new RegExp(( typeof args.documentname !== 'undefined' ? args.documentname.trim() : args.documentname),'i'),
            isdel : false
        };
    }

    /* console.log("\nconditions => ");
    console.log(conditions);  */ 

    return documentModel.find(conditions);
}


// Resolver function for query searchCandidateDocuments({input}) : [Document]
const searchCandidateDocuments = (args, context, info) =>
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

    return documentModel.find(conditions);
}



// Resolver function for mutation uploadDocuments(input) : String
const createDocument = async (args, context, info) =>
{
    args = args || '';
    let documents = context.files || [];
    let document;
    let createDocumentJSON;
    let documentID = "0";
    let candidateID = "0";
    let documentsUploaded = [];

    for( let i = 0 ; i < documents.length; i++)
    {

        document = documents[i];

        /* console.log("-----------------------------------");
        console.log("Document Name : " + document.originalname);
        console.log("Mime Type : " + document.mimetype);
        console.log("Document Size : " + document.size); */

        documentID = sysdate_yyyymmdd + systime_hh24mmss +  math.randomInt(101, 999);

        // Get auto-generated number for candidates id
        candidateID = sysdate_yyyymmdd + systime_hh24mmss + math.randomInt(101, 999);

        createDocumentJSON = {
            "client"          :   args.client,
            "lang"            :   args.lang,
            //"candidateid"     :   args.candidateid,
            "candidateid"     :   candidateID,
            "documentid"      :   documentID,
            "documentname"    :   document.originalname,
            "documenttype"    :   document.mimetype,
            "documentsize"    :   document.size,
            "document"        :   document.buffer
        }

        // Instanciate Document Model                    
        const documentModelInst = new documentModel(createDocumentJSON);
        documentModelInst.AddCreateParams();

        await documentModelInst.save();
        
        documentsUploaded[i] = {
            "client"        : args.client,
            "lang"          : args.lang,
            "candidateid"   : candidateID,
            "documentid"    : documentID
        } 

        //documentsUploaded[i] = documentID;

    }

    //console.log(documentsUploaded);
    
    return documentsUploaded;

}


// Download document
const downloadDocument = async (httpRequest) =>
{
    //console.log(httpRequest.query.documentID);
    
    // Get the document id from request
    let documentID = httpRequest.query.documentID;

    // Clause JSON
    let conditions = {
        "documentid" : documentID
    };

    // Projection
    //let requiredFields = 'document documenttype documentsize documentname';

    // Get the document from document collection
    //let result = await documentModel.findOne(conditions, requiredFields);
    let result = await documentModel.findOne(conditions);

    /* console.log("result => ");
    console.log(result._id); */
    
    return await result;
}


// Resolver function for mutation removeDocuments(input) : String
const removeDocument = async (args, context, info) =>
{
    try 
    {
        args = args || '';

        let updateDocumentDataJSON;
        let updateDocumentClauseJSON;    
        
        // form the data json object
        updateDocumentDataJSON = {
            "ddate"         :   sysdate_yyyymmdd,
            "dtime"         :   systime_hh24mmss,
            "isdel"         :   true
        }

        // form the clause json object
        updateDocumentClauseJSON = {
            "client" 		:	args.client,
            "lang"		    :	args.lang,
            "candidateid"	: 	args.candidateid
        }

        let result = await documentModel.updateMany(updateDocumentClauseJSON, updateDocumentDataJSON, {new : true});    
        
        return 1;
            
    } 
    catch (error) 
    {
        return error;        
    }

}


// Resolver function for mutation updateDocuments(input) : String
const updateDocument = async (args, context, info) =>
{
    try 
    {
        args = args || '';
        let documents = context.files || [];
        let documentsUploaded = [];

        if(documents.length !=0 )
        {
            // Validate input data
            args = await validateUpdateData(args);

            // Remove previous documents
            removeDocument(args, context);

            // Upload new document 
            let document;
            let createDocumentJSON;
            let documentID = "0";
            let candidateID = "0";
        
            for( let i = 0 ; i < documents.length; i++)
            {
        
                document = documents[i];
        
                /* console.log("-----------------------------------");
                console.log("Document Name : " + document.originalname);
                console.log("Mime Type : " + document.mimetype);
                console.log("Document Size : " + document.size); */
        
                documentID = sysdate_yyyymmdd + systime_hh24mmss +  math.randomInt(101, 999);
        
                // Get auto-generated number for candidates id
                candidateID = args.candidateid;
        
                createDocumentJSON = {
                    "client"          :   args.client,
                    "lang"            :   args.lang,
                    //"candidateid"     :   args.candidateid,
                    "candidateid"     :   candidateID,
                    "documentid"      :   documentID,
                    "documentname"    :   document.originalname,
                    "documenttype"    :   document.mimetype,
                    "documentsize"    :   document.size,
                    "document"        :   document.buffer
                }
        
                // Instanciate Document Model                    
                const documentModelInst = new documentModel(createDocumentJSON);
                documentModelInst.AddCreateParams();
        
                await documentModelInst.save();
                
                documentsUploaded[i] = {
                    "client"        : args.client,
                    "lang"          : args.lang,
                    "candidateid"   : candidateID,
                    "documentid"    : documentID
                } 
        
                //documentsUploaded[i] = documentID;
        
            }
        }

        return documentsUploaded;
        
    } 
    catch (error) 
    {
        return error;        
    }

}


// Validation funtion for Document Update
const validateUpdateData = async (args) =>
{
    try 
    {
        let validationObjects = {};

        let validationObject = {};

        validations.checkNull("client", args.client, "Client is required", validationObject);
        validations.checkNull("lang", args.lang, "Language is required", validationObject);
        validations.checkNull("candidateid", args.candidateid, "Candidate id is required", validationObject);

        
        if(Object.keys(validationObject).length != 0)
            validationObjects[0] = validationObject;

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
            
            // Add update params
            args.ddate = curDate;
            args.dtime = curTime;
            args.isdel = true;
                
            return args;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}



// Export functions
module.exports = { 
    searchDocuments,
    searchCandidateDocuments,
    createDocument,
    updateDocument,
    downloadDocument,
    removeDocument
};