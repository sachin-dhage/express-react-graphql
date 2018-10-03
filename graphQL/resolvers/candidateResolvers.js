//import services
import candidateServices from '../../services/candidateServices';
import ratingServices from '../../services/ratingServices';
import documentServices from '../../services/documentServices';

//Resolvers
const resolvers = 
{
    Query:
    {
        // Resolver for searchCandidates(input) : [Candidates]
        searchCandidates : candidateServices.searchCandidates,

        // Resolver for candidateCV(input) : [CandidateCV]
        candidateCV : candidateServices.candidateCV

    },

    Mutation:
    {
        // Resolver for CandidatesCRUDOps(input) : String
        CandidatesCRUDOps : candidateServices.CandidatesCRUDOps
       
    }
};


// Export resolvers
module.exports = resolvers;

