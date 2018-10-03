//import services
import organizationServices from '../../services/organizationServices';

//Resolvers
const resolvers = 
{
    Query:
    {
        // Resolver for searchOrganizations(input) : [Organizations]
        searchOrganizations : organizationServices.searchOrganizations

    },

    Mutation:
    {
        // Resolver for OrganizationsCRUDOps(input) : String
        OrganizationsCRUDOps : organizationServices.OrganizationsCRUDOps
       
    }
};


// Export resolvers
module.exports = resolvers;

