//import services
import cvcategoryServices from '../../services/cvcategoryServices';

//Resolvers
const resolvers = 
{
    Query:
    {
        // Resolver for searchCategories(input) : [Category]
        searchCategories : cvcategoryServices.searchCategories

    },

    Mutation:
    {
        // Resolver for CVCategoryCRUDOps(input) : String
        CVCategoryCRUDOps : cvcategoryServices.CVCategoryCRUDOps
       
    }
};


// Export resolvers
module.exports = resolvers;

