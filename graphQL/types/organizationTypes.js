// Type definitions for Organization 
const typeDefs = `

    # Organization Input Type
    input Organization
    {
        client 	:	String!,
        lang	:	String!,
        organizationid : String,
        name	:	String,
        tanno	:	String,
        panno	:	String,
        gstno	:	String,
        country	:	String,
        website	:	String,
        hrheadfirstname	:	String,
        hrheadlastname	:	String,
        hrheademployeeid	:	String,
        hrheademailid		:	String,
        alternatecontactfirstname	:	String,
        alternatecontactlastname	:	String,
        alternatecontactemployeeid	:	String,
        alternatecontactemailid		:	String,
        ceofirstname	:	String,
        ceolastname	:	String,
        ceoemployeeid	:	String,
        ceoemailid		:	String,
        cfofirstname	:	String,
        cfolastname	:	String,
        cfoemployeeid	:	String,
        cfoemailid		:	String,
        noofemployees		:	String,
        employeeturnover	:	String,
        technology			:	String
    }


    # Output Type
    type Organizations
    {
        client 	:	String!,
        lang	:	String!,
        organizationid : String,
        name	:	String,
        tanno	:	String,
        panno	:	String,
        gstno	:	String,
        country	:	String,
        website	:	String,
        hrheadfirstname	    :	String,
        hrheadlastname	    :	String,
        hrheademployeeid	:	String,
        hrheademailid		:	String,
        alternatecontactfirstname	:	String,
        alternatecontactlastname	:	String,
        alternatecontactemployeeid	:	String,
        alternatecontactemailid		:	String,
        ceofirstname	:	String,
        ceolastname	    :	String,
        ceoemployeeid	:	String,
        ceoemailid		:	String,
        cfofirstname	:	String,
        cfolastname	    :	String,
        cfoemployeeid	:	String,
        cfoemailid		:	String,
        noofemployees		:	String,
        employeeturnover	:	String,
        technology			:	String,
        status          :   String
    }

    # Query Type
    type Query
    {
        """ Search any organization """
        searchOrganizations
        (
            client 		:	String!,
            lang		:	String!,    
            organizationid : String,
            name	    :	String,
            country		:	String,
            technology	:	String,
            exactMatch  :   Boolean = false    
        )   : [Organizations]
         
    }

    # Mutation type
    type Mutation
    {
        # Organization CRUD Operations
        OrganizationsCRUDOps
        (
            transaction :   TransactionTypes!,
            organizations  :   [Organization!]!
        )   :   [String]
    }

`;



// Export the typeDefs
module.exports = typeDefs;