import { applyMiddleware } from 'graphql-middleware';
import fs from 'fs';
import path from 'path';
import {makeExecutableSchema} from 'graphql-tools';

class ApiExplorer {

    constructor() {
        this._read = true;
        this._typeDefs = [];
        this._resolvers = [];
        //this._permissions = {};
        //this._validators = {};
    }

    async _scan(directory) {
        const files = fs.readdirSync(directory)
            .filter(file => fs.lstatSync(path.join(directory, file)).isFile())
            .filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js');

        const dirs = fs.readdirSync(directory)
            .filter(file => fs.lstatSync(path.join(directory, file)).isDirectory());

        for (const file of files) {
            const obj = await import(path.join(directory, file));

            if (obj.typeDefs) {
                this._typeDefs.push(obj.typeDefs);
            }
            if (obj.resolvers) {
                this._resolvers.push(obj.resolvers);
            }
            // if (obj.permissions) {
            //     this._merge(this._permissions, obj.permissions);
            // }
            // if (obj.validators) {
            //     this._merge(this._validators, obj.validators);
            // }
        }

        for (const dir of dirs) {
            await this._scan(path.join(directory, dir));
        }
    }

    async getSchema() {
        if (this._read) {
            await this._scan(__dirname);
            this._read = false;
        }

        // Create graphql schema with middleware
        const schema = makeExecutableSchema({ typeDefs: this._typeDefs, resolvers: this._resolvers });

        return applyMiddleware(schema);
        // return applyMiddleware(schema,
        //     this._validators,
        //     shield(this._permissions, {
        //         allowExternalErrors: true,
        //         fallbackError: new ForbiddenError('Not Authorised!')
        //     }));
    }
}


export const apiExplorer = new ApiExplorer();
