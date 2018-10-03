import gql from 'graphql-tag';
export const CandidateDeleteQueries = gql`
mutation Candidate(
  $transaction : TransactionTypes!,
  $candidates : [Candidate!]!
)
{
  CandidatesCRUDOps
  (
    transaction : $transaction,
    candidates : $candidates
  )
}`;

//..............search Candidates...............
export const CandidateDetailsQueries = gql`
query candidateDetails($clnt:String!,$lang:String!,$candidateid:String,$experience:String,$technology:String,$exactMatch:Boolean){
  searchCandidates(client:$clnt,lang:$lang,candidateid:$candidateid,experience:$experience,technology:$technology,exactMatch:$exactMatch)
  {
    client
    lang
    candidateid
    firstname
    middlename
    lastname
    emailid
    mobileno
    idprooftype
    idproofno
    experience
    country
    technology
    ratings{
      ratingid,
      technology,
      rating}
    document{
      documentid
      documentname
      documenttype
      documentsize
       
    }
  }
}
`;

export const CandidateRegQueries = gql`
mutation Candidate(
  $transaction : TransactionTypes!,
  $candidates : [Candidate!]!
)
{
  CandidatesCRUDOps
  (
    transaction : $transaction,
    candidates : $candidates
  )
}`;

export const CRUDOrgQuery = gql`mutation Organizations
(
  $organization: [Organization!]!,
  $transaction :TransactionTypes!
)
{
OrganizationsAffected : OrganizationsCRUDOps
  (
    organizations : $organization,
    transaction : $transaction
  )

}`;

//..............Candidate DDL...............
export const DLLQueries = gql`
query DDL($CLNT:String!,$LANG:String!,$category:String)
{
  IDPROOF:populateDDL
  (
    ddlName : IDPROOF,
    paraArray : [$CLNT, $LANG]
  )
  {
    code
    desc
  }
  
  
  COUNTRY:populateDDL
  (
    ddlName : COUNTRY,
    paraArray : [$CLNT, $LANG]
  )
  {
    code
    desc

  }
  
  TECHNOLOGY :searchCategories(client:$CLNT , lang:$LANG , category:$category){
       inference
  }
}`;

export const SearchOrganizationQuery = gql`query SearchOrganizations($client:String!,$lang:String!,$exactMatch:Boolean,$organizationid:String)
{
  searchOrganizations(client:$client,lang:$lang,organizationid:$organizationid,exactMatch:$exactMatch)
  {
   organizationid
    name
    tanno
    panno
    gstno
    country
    website
    hrheadfirstname
    hrheadlastname
    hrheademailid
    hrheademployeeid
    alternatecontactfirstname
    alternatecontactlastname
    alternatecontactemailid
    alternatecontactemployeeid
    ceofirstname
    ceolastname
    ceoemailid
    ceoemployeeid
    cfofirstname
    cfolastname
    cfoemailid
    cfoemployeeid
    noofemployees
    employeeturnover
    technology
    status
  }
}`;


// CV Category CRUDOPS
export const CVCategoryCRUDOps = gql`mutation CVCategory
(
  $CVCategory: [CVCategory!]!,
  $transaction :TransactionTypes!
)
{
CVCategoryAffected : CVCategoryCRUDOps
  (
    cvcategories : $CVCategory,
    transaction : $transaction
  )

}`;

// To Search Category
export const searchCategories = gql`query searchCategories ($client:String!,$lang:String!,$category:String,$attribute:String,$inference:String,$exactMatch:Boolean)
{
  searchCategories(client:$client,lang:$lang,category:$category,attribute:$attribute,inference:$inference,exactMatch:$exactMatch)
  {
    client
    lang
    category
    attribute
    inference
  }
}
`;


// to search CV summary
export const searchCVSummaryQuery = gql`
query($client:String!,
  $lang:String!,
  $cvid:String!)
  {
  searchCVSummary
  (client:$client,
  lang : $lang,
  cvid :$cvid ,

  )
  {
    cvid
    executionid
    category
    attribute
    count
    inference
  }
}
`
// file upload query
export const fileUploadQuery = `
mutation($client:String,$lang:String){
  uploadDocuments
  (
    client : $client,
    lang : $lang
  )
  {
    client
    lang
    candidateid
    documentid
  }
}`

// file update query
export const fileUpdateQuery = `
mutation($client:String!,$lang:String!,$candidateid:String!){
  updateDocuments(
client:$client,
  lang:$lang,
  candidateid:$candidateid)
  {
    client
    lang
    candidateid
    documentid
  }
}`

//...Proposal Category.....
export const searchProposalCategories = gql`query searchProposalCategories($client:String!,$lang:String!,$attribute:String!,$count:String,$exactMatch:Boolean) {
  searchProposalCategories(
  client:$client,
    lang:$lang,
    attribute:$attribute,
    count:$count
    exactMatch:$exactMatch
  )
  {
    client
    lang
    attribute
    count
  }
}`;


//.....Dashboard.....................
export const searchDashboard = gql`query searchDashboard($client:String!,$lang:String!,$attribute:String,$exactMatch:Boolean){
  searchDashboard(client:$client,lang:$lang,attribute:$attribute,exactMatch:$exactMatch){
    Proposal
    Known
    Unknown
    Ignore
  }
}`;

//Search Unknown Categories and Count HR

export const searchUnknownCategoriesDetails = gql`query searchUnknownCategories($CLNT:String!,$LANG:String!,$ATTRIBUTE:String,$COUNT:String,$exactMatch:Boolean)
{
  searchUnknownCategories(client:$CLNT 
    lang :$LANG, 
    attribute:$ATTRIBUTE,
    count:$COUNT,
  exactMatch:$exactMatch)
  {
    client,
    lang,
    attribute,
    count
  }
}`;

//populate categories ddl
export const CategoriesDDLQuery = gql`query populateDDL($ddlName: DDLTypes!,$clnt:String!,$lang:String!)
{
  Categories:populateDDL(ddlName:$ddlName 
    paraArray:[$clnt,$lang ])
    {
      code
      desc
    }
}`;

//process  unknown categories

export const CVProcessUnknownCategory = gql`
mutation CVProcessUnknownCategory
(
  $transaction: TransactionTypes!,
  $cvunknowncat: [CVUnknownCategoryProcess!]!
) 
{
  CVProcessUnknownCategory(transaction: $transaction, cvunknowncat: $cvunknowncat)
  
}`;

//search Ignore Categopries 
export const searchIgnoreCategories = gql`query searchIgnoreCategories($CLNT:String!,$LANG:String!,$ATTRIBUTE:String,$exactMatch:Boolean)
{
  searchIgnoreCategories(client:$CLNT 
    lang :$LANG, 
    attribute:$ATTRIBUTE,
    exactMatch:$exactMatch
    )
  {
    client,
    lang,
    attribute,
   
  }
}`;

