
//Import all mongoose models
import candidateModel from './candidateModel';
import ratingModel from './ratingModel';
import documentModel from './documentModel';
import idproofModel from './idproofModel';
import countryModel from './countryModel';
import organizationModel from './organizationModel';
import cvsummaryModel from './cvsummaryModel';
import cvcategoryModel from './cvcategoryModel';
import cvunknowncatModel from './cvunknowncatModel';
import cvignorecatModel from './cvignorecatModel';
import cvproposalcatModel from './cvproposalcatModel';

// Export all mongoose models
module.exports = {
    candidateModel,
    ratingModel,
    documentModel,
    idproofModel,
    countryModel,
    organizationModel,
    cvsummaryModel,
    cvcategoryModel,
    cvunknowncatModel,
    cvignorecatModel,
    cvproposalcatModel
};