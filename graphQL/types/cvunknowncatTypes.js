// Type definitions for CV Unknown Category 
const typeDefs = `

    # CV Unknown Category Input Type
    input CVUnknownCategory
    {
        client  :   String,
        lang    :   String,
        attribute : String
    }

    input CVUnknownCategoryProcess
    {
        client  :   String,
        lang    :   String,
        category  : String,
        attribute : String,
        inference : String
    }

    # Output Type
    type CVUnknownCategories
    {
        client  :   String,
        lang    :   String,
        attribute : String,
        count   :   String
    }

    type CVIgnoreCategories
    {
        client  :   String,
        lang    :   String,
        attribute : String
    }

    # Query Type
    type Query
    {
        """ Search any unknown category """
        searchUnknownCategories
        (
            client 		:	String!,
            lang		:	String!,
            attribute   :   String,
            count       :   String,
            exactMatch  :   Boolean = false       
        )   : [CVUnknownCategories]

        searchIgnoreCategories
        (
            client 		:	String!,
            lang		:	String!,
            attribute   :   String ,
            exactMatch  :   Boolean = false     
        )   : [CVIgnoreCategories]
         
    }

    # Mutation type
    type Mutation
    {
        """ CV Unknown Category CRUD Operations """
        CVUnknownCategoryCRUDOps
        (
            transaction  :   TransactionTypes!,
            cvunknowncat :   [CVUnknownCategory!]!
        )   :   String


        CVProcessUnknownCategory
        (
            transaction  :   TransactionTypes!,
            cvunknowncat :   [CVUnknownCategoryProcess!]!
        ) : String
    }

`;



// Export the typeDefs
module.exports = typeDefs;