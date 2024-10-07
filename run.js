#!/usr/bin/env node
// Requires Node 18 or later due to Fetch API
import env from "dotenv";
env.config();

async function getAccessToken(email, apiKey) {
  const response = await fetch(
    `https://api.cloudways.com/api/v1/oauth/access_token?email=${email}&api_key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        api_key: apiKey,
      }),
    }
  );
  let accessToken = await response.json();
  return accessToken.access_token;
}

async function main() {
  const accessToken = await getAccessToken(process.env.EMAIL, process.env.API_KEY);
  const response = await fetch("https://api.cloudways.com/api/v1/git/clone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      app_id: process.env.APP_ID,
      server_id: process.env.SERVER_ID,
      branch_name: process.argv[3],
      deploy_path: process.env.DEPLOY_PATH,
      git_url: process.argv[2],
    }),
  });
}