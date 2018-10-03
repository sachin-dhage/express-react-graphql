// Type definitions for Rating
const typeDefs = `

    # Rating Input Type
    input Rating
    {
        ratingid    :   String,
        technology	:	String,
        rating		:	String    
    } 

    # Output Type
    type Ratings
    {
        ratingid	:	String,
		technology	:	String,
		rating		:	String	  
    }

`;


// Export the typeDefs
module.exports = typeDefs;