# Node.js Code Example for Cloudways API

Using the Node.js Express module, this application simply makes API calls to deploy recent commits to a Git repository on a Cloudways application. Here are some variables that need to be set:

There are a few environment variables that need to be set:

- APP_URL: URL of the application that receives webhook requests.
- API_URL: URL of the Cloudways API.
- EMAIL: Email address of the Cloudways account that the API key is generated on.
- API_KEY: API key of the Cloudways account that contains the application(s) to be deployed using webhooks.


