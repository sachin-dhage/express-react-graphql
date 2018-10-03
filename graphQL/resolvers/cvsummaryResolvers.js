//import services
import cvsummaryServices from '../../services/cvsummaryServices';

//Resolvers
const resolvers = 
{
    Query:
    {
        // Resolver for searchCVSummary(input) : [CVSummaries]
        searchCVSummary : cvsummaryServices.searchCVSummary
        
    },

    Mutation:
    {
        // Resolver for CVSummaryCRUDOps(input) : String
        CVSummaryCRUDOps : cvsummaryServices.CVSummaryCRUDOps
       
    }
};


// Export resolvers
module.exports = resolvers;

