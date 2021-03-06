import express from 'express';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { apiExplorer } from './api';
import cors from 'cors';
import { createStore } from './utils';
import { getUserIdFromToken, getUser } from './auth';

require('dotenv').config();

const port = process.env.PORT || 8080;
const store = createStore();

apiExplorer.getSchema()
.then(async (schema) => {
    // Configure express
    const app = express();
    app.use(express.json());
    app.use(cors());
    
    await store.Users.sync({force: true});
    await store.Species.sync({force: true});
    await store.Locations.sync({force: true});
    await store.Photos.sync({force: true});

    // Configure apollo
    const apolloServer = new ApolloServer({
        schema,

        dataSources: () => ({          
        }),

        context: async ({ req, res }) => {
            const bearerHeader = req.headers['authorization'] || '';
            let bearerToken = '';
            if (bearerHeader) {
                
                let bearer = bearerHeader.split(' ');
                bearerToken = bearer[1];
            }
            if (bearerToken === 'undefined') {
                return;
            }

            let userId = await getUserIdFromToken(bearerToken);;
            let user = await getUser(userId, store);
            
            return { user: user };
        },
    });

    apolloServer.applyMiddleware({ app });

    // Run server
    app.listen({ port }, () => {
        console.log(`🚀Server ready at http://localhost:${ port }${ apolloServer.graphqlPath }`);
    });
})
.catch(err => {
    console.log(err);
});