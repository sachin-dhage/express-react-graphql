import { mergeTypes } from "merge-graphql-schemas";

// Importing types
import documentTypes from './documentTypes';
import ratingTypes from './ratingTypes';
import candidateTypes from './candidateTypes';
import enumTypes from './enumTypes';
import ddlTypes from './ddlTypes';
import organizationTypes from './organizationTypes';
import cvsummaryTypes from './cvsummaryTypes';
import cvcategoryTypes from './cvcategoryTypes';
import cvunknowncatTypes from './cvunknowncatTypes';
import cvproposalcatTypes from './cvproposalcatTypes';
import cvdashboardTypes from './cvdashboardTypes.js';

// Merge all of the types together
const types = [
                documentTypes,
                candidateTypes,
                ratingTypes,
                enumTypes,
                ddlTypes,
                organizationTypes,
                cvsummaryTypes,
                cvcategoryTypes,
                cvunknowncatTypes,
                cvproposalcatTypes,
                cvdashboardTypes
              ];
  
// NOTE: 2nd param is optional, and defaults to false
// Only use if you have defined the same type multiple times in
// different files and wish to attempt merging them together.
const typeDefs =  mergeTypes(types, { all: true });


module.exports = typeDefs;

