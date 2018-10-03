import { merge } from "lodash";

//Importing resolvers
import documentResolvers from './documentResolvers';
import candidateResolvers from './candidateResolvers';
import ddlResolvers from './ddlResolvers';
import organizationResolvers from './organizationResolvers';
import cvsummaryResolvers from './cvsummaryResolvers';
import cvcategoryResolvers from './cvcategoryResolvers';
import cvunknowncatResolvers from './cvunknowncatResolvers';
import cvproposalcatResolvers from './cvproposalcatResolvers';
import cvdashboardResolvers from './cvdashboardResolvers';

// Merge all of the resolver objects together
const resolvers = merge(
                            documentResolvers.Mutation,
                            documentResolvers.Query,
                            candidateResolvers.Mutation,
                            candidateResolvers.Query,
                            ddlResolvers.Query,
                            organizationResolvers.Query,
                            organizationResolvers.Mutation,
                            cvsummaryResolvers.Query,
                            cvsummaryResolvers.Mutation,
                            cvcategoryResolvers.Mutation,
                            cvcategoryResolvers.Query,
                            cvunknowncatResolvers.Query,
                            cvunknowncatResolvers.Mutation,
                            cvproposalcatResolvers.Query,
                            cvproposalcatResolvers.Mutation,
                            cvdashboardResolvers.Query
);


 // Merge all of the resolver objects together
/*const resolvers = merge(
    documentResolvers,
    candidateResolvers,
    ddlResolvers
);*/


// Export merged resolvers
module.exports = resolvers;