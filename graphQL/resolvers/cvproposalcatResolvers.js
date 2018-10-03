//import services
import cvproposalcatServices from '../../services/cvproposalcatServices';

//Resolvers
const resolvers = 
{
    Query:
    {
        // Resolver for searchProposalCategories(input) : [ProposalCategory]
        searchProposalCategories : cvproposalcatServices.searchProposalCategories

    },

    Mutation:
    {
        // Resolver for CVProposalCategoryCRUDOps(input) : String
        CVProposalCategoryCRUDOps : cvproposalcatServices.CVProposalCategoryCRUDOps
       
    }
};


// Export resolvers
module.exports = resolvers;

