/*
 * Environment Configuration
 *
 * See https://create-react-app.dev/docs/adding-custom-environment-variables/
 * for details on working with env variables with create-react-app.
 */

let cosmosURL;

if (process.env.REACT_APP_COSMOS_URL) {
  cosmosURL = process.env.REACT_APP_COSMOS_URL;
} else {
  cosmosURL = 'http://127.0.0.1:1317';
}

export const COSMOS_URL = cosmosURL;