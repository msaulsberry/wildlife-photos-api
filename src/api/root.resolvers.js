import { readFileSync } from 'fs';
import { GraphQLDateTime } from 'graphql-iso-date';

export const typeDefs = readFileSync(`${ __dirname }/root.schema.graphql`, 'utf8');

export const resolvers = {

    DateTime: GraphQLDateTime,
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