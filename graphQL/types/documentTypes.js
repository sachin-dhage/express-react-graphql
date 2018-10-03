// Type definitions for Document 
const typeDefs = `

    # Document Type
    type Document
    {
        client  :   String,
        lang    :   String,
        candidateid	: 	String,
        documentid    :   String,
        documentname  :   String,
        documenttype  :   String,
        documentsize  :   String,
        document      :   String,
        cdate         :   String
    }

    # Candidate Document Type
    type CandidateDocument
    {
        client  :   String,
        lang    :   String,
        candidateid	  :   String,
        documentid    :   String
    }



    # Query Type
    type Query
    {
        # Search the documents
        searchDocuments
        (
            client          :   String!,
            lang            :   String!,
            documentName    :   String,
            exactMatch      :   Boolean = false
        )   : [Document]
    }

    # Mutation type
    type Mutation
    {
        # Upload the document, returns the document ID
        uploadDocuments
        (
            client      :   String,
            lang        :   String
        ) : [CandidateDocument]


        # Update the document, returns the document ID
        updateDocuments
        (
            client      :   String!,
            lang        :   String!,
            candidateid	  :   String!            
        ) : [CandidateDocument]

    }


`;



// Export the typeDefs
module.exports = typeDefs;