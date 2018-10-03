// Type definitions for CV Proposal Category 
const typeDefs = `

    # CV Proposal Category Input Type
    input CVProposalCategory
    {
        client  :   String,
        lang    :   String,
        attribute : String
    }

    # Output Type
    type CVProposalCategories
    {
        client  :   String,
        lang    :   String,
        attribute : String,
        count   :String
    }

    # Query Type
    type Query
    {
        """ Search any proposal category """
        searchProposalCategories
        (
            client 		:	String!,
            lang		:	String!,
            attribute   :   String,
            count       :   String,
            exactMatch  :   Boolean = false
        )   : [CVProposalCategories]
         
    }

    # Mutation type
    type Mutation
    {
        """ CV Proposal Category CRUD Operations """
        CVProposalCategoryCRUDOps
        (
            transaction   :   TransactionTypes!,
            cvproposalcat :   [CVProposalCategory!]!
        )   :   String
    }

`;



// Export the typeDefs
module.exports = typeDefs;