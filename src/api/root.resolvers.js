import { readFileSync } from 'fs';

export const typeDefs = readFileSync(`${ __dirname }/root.schema.graphql`, 'utf8');

export const resolvers = {
    Query: {

        sayHello: (obj, args, context, info) => {
            return `Hello ${ args.name }!`;
        }
    },

    Mutation: {

        sayHello: (obj, args, context, info) => {
            return `Hello ${ args.name }!`;
        }
    }
};