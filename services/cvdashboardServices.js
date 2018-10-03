import connection from "../config/db/dbConnect";
import {cvproposalcatModel,cvignorecatModel,cvunknowncatModel,cvcategoryModel } from "../models/mongoose";
import { log } from "util";

const searchDashboard = async (args, context, info) =>
{
    let conditions;
    let exactMatch =args.exactMatch
    

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

        // condition object
    
    }
    let proposalCount =cvproposalcatModel.find(conditions).count()
    let knownCount =cvcategoryModel.find(conditions).count()
    let unknownCount =cvunknowncatModel.find(conditions).count()
    let ignoreCount =cvignorecatModel.find(conditions).count()


    return {'Proposal':proposalCount ,'Known':knownCount ,'Unknown':unknownCount ,'Ignore':ignoreCount};
}

module.exports={
    searchDashboard
}