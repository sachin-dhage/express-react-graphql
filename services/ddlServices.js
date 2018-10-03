import {idproofModel, countryModel,cvcategoryModel} from '../models/mongoose';


// Resolver function for query populateDDL(input) : [DDL]
const populateDDL = async (args, context, info) =>
{
    try 
    {
        let ddlName = args.ddlName;
        let ddlQuery;
        let result;
        let result1;
        let conditions;
        
        if(typeof ddlName === 'undefined' || ddlName == null || ddlName.trim().length == 0)
            throw new Error("DDL Name is required.");

        ddlName = ddlName.trim().toUpperCase();
    
        // Placeholders 
        let placeHolders = args.paraArray || [];

        // Get ddl query for request ddl
        switch (ddlName) {
            case 'IDPROOF':
                conditions = {        
                    client : ((typeof placeHolders[0] !== 'undefined' && placeHolders[0].trim() ) ? placeHolders[0].trim() : new RegExp(placeHolders[0],'i') ),
                    lang : ((typeof placeHolders[1] !== 'undefined' && placeHolders[1].trim() ) ? placeHolders[1].trim() : new RegExp(placeHolders[1],'i') ),
                }
                result = idproofModel.find(conditions);               
                break;

            case 'COUNTRY':
                conditions = {        
                    client : ((typeof placeHolders[0] !== 'undefined' && placeHolders[0].trim() ) ? placeHolders[0].trim() : new RegExp(placeHolders[0],'i') ),
                    lang : ((typeof placeHolders[1] !== 'undefined' && placeHolders[1].trim() ) ? placeHolders[1].trim() : new RegExp(placeHolders[1],'i') ),
                }
                result = countryModel.find(conditions);               
                break;
            case 'CATEGORY':
                        conditions = {        
                            client : ((typeof placeHolders[0] !== 'undefined' && placeHolders[0].trim() ) ? placeHolders[0].trim() : new RegExp(placeHolders[0],'i') ),
                            lang : ((typeof placeHolders[1] !== 'undefined' && placeHolders[1].trim() ) ? placeHolders[1].trim() : new RegExp(placeHolders[1],'i') ),
                            isdel :false
                        }
                        result = new Promise(function(resolve,reject){
                            result1 = cvcategoryModel.aggregate([
                                {
                                    $match :conditions
                                },
                                
                                {
                                    $project:{
                                        'code':'$category',
                                        'desc':'$category'  
                                        }
                                }

                                ]);
                            result1.then(data=>{
                                    //console.log(data)
                                    var returnObject=[]
                                    if(data.length>0){
                                    returnObject.push(data[0])
                                    }
                                    for(var i in data){
                                        var test=false
                                        var doc=data[i]
                                        for(var j in returnObject){
                                            if(doc['code']===returnObject[j]['code'] && doc['desc']===returnObject[j]['desc']  )
                                            {
                                                test=false
                                                break 
                                            }
                                            else{
                                                test=true 
                                                
                                            }
                    
                                        }
                                        
                                        if(test){
                                            returnObject.push(doc)
                                        }
                    
                                    }
                                    //console.log(doc)
                                    resolve(returnObject)
                    
                                })


                }) 
            break;    


            default:
                throw new Error("Invalid DDL name specified.");
                break;
        }

        return result;
            
    } 
    catch (error) 
    {
        return error;    
    }

}

//Export modules
module.exports = {
    populateDDL
};