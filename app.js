// app.js
import express, { json } from "express";
import env from "dotenv";
const app = express();
const port = 3000;

// Load environment variables
env.config();

// Middleware to parse JSON bodies
app.use(json());

// Variables for the Cloudways API
const appUrl = process.env.APP_URL || "http://localhost";
const url = process.env.API_URL || "https://api.cloudways.com/api/v1";
const email = process.env.EMAIL || "john@doe.com";
const apiKey = process.env.API_KEY || "your-api-key";

// Get an oAuth Token for the request
async function getAccessToken(email, apiKey) {
  const response = await fetch(
    `${url}/oauth/access_token?email=${email}&api_key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        email: email,
        api_key: apiKey,
      },
    }
  );

  const data = await response.json();
  return data.access_token;
}

// Endpoint to handle GET and POST requests
app.all("/webhook/:serverId/:appId", async (req, res) => {
  const { serverId, appId } = req.params;
  const accessToken = await getAccessToken(email, apiKey);
  try {
    // Make a POST call to the Cloudways API
    const endpoint =
      req.body.git_url || req.query.git_url ? "/git/clone" : "/git/pull";
    let git_url =
      req.body.git_url || req.query.git_url
        ? { git_url: req.body.git_url || req.query.git_url }
        : {};
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const payload = {
      app_id: appId,
      server_id: serverId,
      branch_name: req.body.branch_name || req.query.branch_name,
      deploy_path: req.body.deploy_path || req.query.deploy_path,
      git_url,
    };
    const response = await fetch(`${url}${endpoint}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    // Send the response from the Cloudways API back to the client
    res.status(response.status).json(data);
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Webhook listener is running on ${appUrl}:${port}`);
});
