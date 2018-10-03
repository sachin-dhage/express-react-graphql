// Type definitions for Candidate 
const typeDefs = `

    # Candidate Input Type
    input Candidate
    {
        client 		:	String!,
        lang		:	String!,
        candidateid :   String,
        firstname	:	String,
        middlename	:	String,
        lastname	:	String,
        emailid		:	String,
        password    :   String,
        mobileno	:	String,
        idprooftype	:	String,
        idproofno	:	String,
        experience	:	String,
        country		:	String,
        technology	:	String,
        ratings     :   [Rating]
    }

    # Output Type
    type Candidates
    {
        client 		:	String,
        lang		:	String,
        candidateid	: 	String,
        firstname	:	String,
        middlename	:	String,
        lastname	:	String,
        emailid		:	String,
        mobileno	:	String,
        idprooftype	:	String,
        idproofno	:	String,
        experience	:	String,
        country		:	String,
        technology	:	String,
        ratings     :   [Ratings],
        document    :   [Document]           
    }

    # Output Type
    type CandidateCV
    {
        candidateid	: 	String,
        document    :   [Document]           
    }


    # Query Type
    type Query
    {
        """ Search any candidate """
        searchCandidates
        (
            client 		:	String!,
            lang		:	String!,    
            candidateid	: 	String,
            firstname	:	String,
            middlename	:	String,
            lastname	:	String,
            emailid		:	String,
            mobileno	:	String,
            idprooftype	:	String,
            idproofno	:	String,
            experience	:	String,
            country		:	String,
            technology	:	String,
            exactMatch  :   Boolean = false    
        )   : [Candidates]

        
        """ Get Candidate CV """
        candidateCV
        (
            client 		:	String!,
            lang		:	String!,    
            candidateid	: 	String,
            documentid  :   String
        )   : [Document]
        
    }

    # Mutation type
    type Mutation
    {
        # Candidate CRUD Operations
        CandidatesCRUDOps
        (
            transaction :   TransactionTypes!,
            candidates  :   [Candidate!]!
        )   :   String
    }

`;



// Export the typeDefs
module.exports = typeDefs;