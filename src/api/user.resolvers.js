import { argsToArgsConfig } from "graphql/type/definition";
import {readFileSync} from 'fs';
const https = require('https');

require('dotenv').config;

export const typeDefs = readFileSync(`${ __dirname }/user.schema.graphql`, 'utf8');

export const resolvers =  {
  Mutation: {
    createUser: (obj, { user }, context, info) => {
      console.log(user);
      createOktaUser(user);

      return {
        success: true,
        message: "Test message"
      };
    }
  }
}


const createOktaUser = async (user) => {
  
  //Perhaps ook into modifying this to add a user to a group

  let data = JSON.stringify({
    profile: {
      firstName: user.first,
      lastName: user.last,
      email: user.email,
      login: user.email,
      mobilePhone: ''
    }
  });

  const options = {
    hostname: process.env.OKTA_DOMAIN,
    method: 'POST',
    path: '/api/v1/users?activate=false',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Accept': 'application/json',
      'Authorization': `SSWS ${process.env.OKTA_API_TOKEN}`
    }
  }

  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      process.stdout.write(d)
    })
  })
  
  req.on('error', error => {
    console.error(error)
  })
  
  req.write(data)
  req.end()
}