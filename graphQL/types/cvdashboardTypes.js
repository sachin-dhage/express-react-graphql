// Type definitions for CV Proposal Category 
const typeDefs = `

    
    # Output Type
    type CVDashBoards
    {
        Proposal  :   String,
        Known  :   String,
        Unknown  :   String,
        Ignore  :   String
    }

    # Query Type
    type Query
    {
        """ Search any proposal category """
        searchDashboard
        (
            client 		:	String!,
            lang		:	String!,
            attribute   :   String ,
            exactMatch  :   Boolean = false
        )   : CVDashBoards
         
    }

  

`;



// Export the typeDefs
module.exports = typeDefs;