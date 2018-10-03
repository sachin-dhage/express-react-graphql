//import services
import cvunknowncatServices from '../../services/cvunknowncatServices';

//Resolvers
const resolvers = 
{
    Query:
    {
        // Resolver for searchUnknownCategories(input) : [UnknownCategory]
        searchUnknownCategories : cvunknowncatServices.searchUnknownCategories,
        searchIgnoreCategories  : cvunknowncatServices.searchIgnoreCategories

    },

    Mutation:
    {
        // Resolver for CVUnknownCategoryCRUDOps(input) : String
        CVUnknownCategoryCRUDOps : cvunknowncatServices.CVUnknownCategoryCRUDOps,
        CVProcessUnknownCategory  :cvunknowncatServices.CVProcessUnknownCategory
       
    }
};


// Export resolvers
module.exports = resolvers;

