// Type definitions for CV Category 
const typeDefs = `

    # CV Category Input Type
    input CVCategory
    {
        client  :   String,
        lang    :   String,
        category  : String,
        attribute : String,
        inference : String
    }

    # Output Type
    type CVCategories
    {
        client  :   String,
        lang    :   String,
        category  : String,
        attribute : String,
        inference : String
    }

    # Query Type
    type Query
    {
        """ Search any category """
        searchCategories
        (
            client 		:	String!,
            lang		:	String!,
            category    :   String,
            attribute   :   String,
            inference   :   String ,
            exactMatch  :   Boolean = false                          
        )   : [CVCategories]
         
    }


    # Mutation type
    type Mutation
    {
        # CV Category CRUD Operations
        CVCategoryCRUDOps
        (
            transaction  :   TransactionTypes!,
            cvcategories :   [CVCategory!]!
        )   :   String
    }

`;



// Export the typeDefs
module.exports = typeDefs;