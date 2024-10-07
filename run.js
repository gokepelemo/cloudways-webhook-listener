#!/usr/bin/env node
// Clones the repository to the Cloudways application

// Environment variables need to be created on the Gitlab
// project documented here: https://docs.gitlab.com/ee/ci/variables/#for-a-project
// EMAIL, API_KEY, APP_ID, SERVER_ID, DEPLOY_PATH

// Requires Node 18 or later due to Fetch API

import env from "dotenv";
env.config();

function consoleMessage(message) {
  console.log(message);
}

async function getAccessToken(email, apiKey) {
  message("Getting access token...");
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
  message("Access token received, now cloning the repository...");
  return accessToken.access_token;
}

async function main() {
  const accessToken = await getAccessToken(
    process.env.EMAIL,
    process.env.API_KEY
  );
  const response = await fetch("https://api.cloudways.com/api/v1/git/clone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      app_id: process.env.APP_ID,
      server_id: process.env.SERVER_ID,
      git_url: process.argv[2],
      branch_name: process.argv[3],
      deploy_path: process.env.DEPLOY_PATH,
    }),
  });
  consoleMessage(await response.json());
}
