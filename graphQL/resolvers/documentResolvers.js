// Import section
import documentServices from '../../services/documentServices';

//Resolvers
const resolvers = 
{
    Query:
    {
        // Resolver for searchDocuments(input) : [Document]
        searchDocuments : documentServices.searchDocuments
    },

    Mutation:
    {
        // Resolver for uploadDocuments(input) : [String]
        uploadDocuments : documentServices.createDocument,

        // Resolver for updateDocuments(input) : [String]
        updateDocuments : documentServices.updateDocument

    }
};


// Export resolvers
module.exports = resolvers;