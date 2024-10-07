# Node.js Code Example for the Cloudways API

Using the Node.js Express module, this application simply makes API calls to deploy recent commits to a Git repository on a Cloudways application. Here are some variables that need to be set:

- `APP_URL`: URL of the application that receives webhook requests.
- `API_URL`: URL of the Cloudways API.
- `EMAIL`: Email address of the Cloudways account that the API key is generated on.
- `API_KEY`: API key of the Cloudways account that contains the application(s) to be deployed using webhooks.

The webhook will listen to GET and POST requests using query params, or properties of a JSON object included in the body of the request. These are the params that are going to be used. The `git_url` param is optional if deployment by git is configured and works on the platform UI:

- `app_id` The ID of the application, extracted from its user interface URL.
- `server_id` The ID of the server, extracted from its user interface URL.
- `git_url` (optional): URL of the git repository. Ensure that the git repository host contains the SSH key of the Cloudways server. More details on this [knowledgebase article](https://support.cloudways.com/en/articles/5124087-deploy-code-to-your-application-using-git#h_052e37347c).
- `branch_name`: Branch to deploy code from.
- `deploy_path`: Path to deploy the code to the server, relative to the `public_html` directory.

Examples for a Github action and Gitlab job can be found in `deploy.yml` and `.gitlab-ci.yml` respectively. Environment variables are set as secrets on Github and project variables on Gitlab. Deploys will only trigger on default branches, otherwise need to updated for staging environments.
