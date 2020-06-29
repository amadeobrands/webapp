/*
 * Environment Configuration
 *
 * See https://create-react-app.dev/docs/adding-custom-environment-variables/
 * for details on working with env variables with create-react-app.
 */

let cosmosURL;
let chainID;

if (process.env.REACT_APP_COSMOS_URL) {
  cosmosURL = process.env.REACT_APP_COSMOS_URL;
} else {
  cosmosURL = 'http://35.193.236.181';
}

export const COSMOS_URL = cosmosURL;

if (process.env.REACT_APP_CHAIN_ID) {
  chainID = process.env.REACT_APP_CHAIN_ID;
} else {
  chainID = 'testing';
}

export const CHAIN_ID = chainID;
