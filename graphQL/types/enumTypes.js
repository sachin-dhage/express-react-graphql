// Enumerations
const typeDefs = `

    enum DDLTypes
    {
        IDPROOF
        COUNTRY
        CATEGORY
    }

    enum TransactionTypes
    {
        CREATE
        UPDATE
        LOGICAL_DELETE
        PHYSICAL_DELETE
        PROCESS
        PHYSICAL_DELETE_IGNORE
    }

 
`;


// Export typeDefs
module.exports = typeDefs;



