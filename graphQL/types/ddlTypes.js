
const typeDefs = `

    # Output Type
    type DDL
    {
        code    :   String,
        desc    :   String
    }

    # Query Type
    type Query
    {
        populateDDL
        (
            ddlName     :   DDLTypes!,
            paraArray   :   [String]!
        )   :   [DDL]
    }
`;

module.exports = typeDefs;

