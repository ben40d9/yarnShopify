// Import the required modules
const http = require("http");
const url = require("url");
const querystring = require("querystring");
const Shopify = require("@shopify/shopify-api");

// Load the environment variables from the .env file
require("dotenv").config();

// Get the Shopify API credentials and other important variables
// from the environment variables
const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST, HOST_SCHEME } =
  process.env;

// Initialize the Shopify API with the provided credentials and settings
Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: [SCOPES],
  HOST_NAME: HOST.replace(/https?:\/\//, ""),
  HOST_SCHEME,
  IS_EMBEDDED_APP: true,
  API_VERSION: "October22", // all supported versions are available, as well as "unstable" and "unversioned"
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

// Handle incoming requests to the server
async function onRequest(request, response) {
  // Get the request URL and headers
  const { headers, url: reqUrl } = request;

  // Get the path and query string from the request URL
  const pathName = url.parse(reqUrl).pathname;
  const queryString = String(url.parse(reqUrl).query);

  // Parse the query string into an object
  const query = querystring.parse(queryString);

  // Check the request path
  switch (pathName) {
    default:
      // This shop hasn't been seen yet, go through OAuth to create a session
      if (ACTIVE_SHOPIFY_SHOPS[SHOP] === undefined) {
        // not logged in, redirect to login
        response.writeHead(302, { Location: "/login" });
        response.end();
      } else {
        // Write "Hello world!" to the response
        response.write("Hello world!");
        // Load your app skeleton page with App Bridge, and do something amazing!
      }
      return;
  } // end of default path
} // end of onRequest()

// Create the server and listen for requests on port 3000
http.createServer(onRequest).listen(3001);
