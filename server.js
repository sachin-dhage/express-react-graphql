  // Import section
  import express from 'express';
  import cors from 'cors';
  import bodyParser from 'body-parser';
  import graphqlHTTP from 'express-graphql';
  import { buildSchema } from 'graphql';
  //import { makeExecutableSchema } from "graphql-tools";
  import multer from 'multer';
  import fileSystem from 'fs';
  //Import the date format module
  import dateFormat from 'dateformat';
  // Import the document services
  import documentServices from './services/documentServices';
  // Importing types
  import typeDefs from './graphQL/types';
  //Importing resolvers
  import resolvers from './graphQL/resolvers';


let startServer = function(clusterid=10000){
            var now = new Date();
            var sysdate_yyyymmdd = dateFormat(now,'yyyymmdd');
            var systime_hh24mmss = dateFormat(now,'HHMMss');



            // Make executable schema
            let graphQLSchema = buildSchema(typeDefs);



            // Make executable schema
            //let graphQLSchema = makeExecutableSchema({typeDefs, resolvers});

            // Set the port number
            const PORT = 5000;

            // Initialize the app
            const server = express();

            // Controls the maximum request body size
            let jsonParser       = bodyParser.json({limit:'1gb', type:'application/json'});
            let urlencodedParser = bodyParser.urlencoded({ extended:true,limit:'1gb',type:'application/x-www-form-urlencoding' })

            server.use(jsonParser);
            server.use(urlencodedParser);

            //Restrict the client-origin for security reasons.
            //server.use('*', cors({ origin: 'http://localhost:3000' }));
            server.use(cors());

            // simple middleware function
            server.use((request, response, next)=>{
              console.log("Request received at : " + sysdate_yyyymmdd + " " + systime_hh24mmss +" $ Cluster ID :"+clusterid );
              next();
            });


            // service to download file
            server.get('/hrai/download', async (request, response) => {

              //let bufferedData = fileSystem.readFileSync("timon-icon.png");
              //let fileContents = Buffer.from(bufferedData, "binary");
              //response.download("timon-icon.png");

              // Get the document from database
              let document = await documentServices.downloadDocument(request);
              
              // Get document buffer
              let bufferedData = document.document;
              //let fileContents = await Buffer.from(bufferedData, "binary");

              console.log("Downloading file : " + document.documentname);

              // Set response header 
              response.setHeader("Content-disposition", "attachment; filename="+document.documentname);
              response.setHeader("Content-type", document.documenttype);
              response.setHeader("Content-Length", document.documentsize);
              
              // Set respose body
              //response.send(fileContents);
              response.send(bufferedData);

            });



            // Use multer middleware to read the files from multipart-request
            // Use memory storage
            server.use(multer({
              storage: multer.memoryStorage()
            }).any());


            // The GraphQL endpoint
            server.use('/hrai', graphqlHTTP({
              schema : graphQLSchema,
              rootValue : resolvers,
              graphiql : true
            }));
            
            /*// The GraphQL endpoint
            server.use('/hrai', graphqlHTTP({
              schema : graphQLSchema,
              graphiql : true
            }));*/



            // Start the server
            server.listen(PORT, () => {
              console.log(`GraphQL Server is now running on http://localhost:${PORT}/hrai`);
              console.log(`Go to http://localhost:${PORT}/hrai to run queries! Cluster ${clusterid}`);
              console.log('------------------------------------------------------');
            });

          }

       //   startServer()

module.exports={
  startServer
}