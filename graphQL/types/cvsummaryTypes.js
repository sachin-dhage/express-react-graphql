// Type definitions for CV Summary 
const typeDefs = `

    # CV Summary Input Type
    input CVSummary
    {
        client  :   String,
        lang    :   String,
        cvid    :   String,
        executionid  :   String,
        category  : String,
        attribute : String,
        count     : String,
        inference : String
    }

    # Output Type
    type CVSummaries
    {
        client  :   String,
        lang    :   String,
        cvid    :   String,
        executionid  :   String,
        category  : String,
        attribute : String,
        count     : String,
        inference : String
    }

    # Query Type
    type Query
    {
        """ Search CV Summary """
        searchCVSummary
        (
            client 		:	String!,
            lang		:	String!,    
            cvid 		:	String!    
        )   : [CVSummaries]
         
    }


    # Mutation type
    type Mutation
    {
        # CVSummary CRUD Operations
        CVSummaryCRUDOps
        (
            transaction :   TransactionTypes!,
            cvsummaries :   [CVSummary!]!
        )   :   String
    }

`;



// Export the typeDefs
module.exports = typeDefs;