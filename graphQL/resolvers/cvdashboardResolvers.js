//import services
import cvdashboardServices from '../../services/cvdashboardServices';

//Resolvers
const resolvers = 
{
    Query:
    {
        // Resolver for searchDashboard(input) : CVDashborad
        searchDashboard : cvdashboardServices.searchDashboard

    }
};


// Export resolvers
module.exports = resolvers;

