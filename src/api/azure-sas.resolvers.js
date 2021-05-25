import { readFileSync } from 'fs';
import { StorageSharedKeyCredential, ContainerSASPermissions, generateBlobSASQueryParameters } from '@azure/storage-blob';

require('dotenv').config();

export const typeDefs = readFileSync(`${ __dirname }/azure-sas.schema.graphql`, 'utf8');

export const resolvers = {
  Query: {
      getSas: (obj, args, context, info) => {
          if (!context.user) return null;

          return getNewSasToken();
      }
  }
};

const containerName = process.env.AZURE_CONTAINER;
const accountName = process.env.AZURE_ACCOUNT;
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, process.env.AZURE_STORAGE_KEY);

const getNewSasToken = async () => {

  const sasOptions = {
    containerName: containerName,
    permissions: ContainerSASPermissions.parse("racwdl"),
    expiresOn: new Date(new Date().valueOf() + 17200000),
  };

  const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
  return sasToken;
}