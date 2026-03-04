require("dotenv").config({ path: ".env" });

module.exports = {
  apps: [
    {
      name: "farmera-web-admin",
      script: "node_modules/.bin/next",
      args: "start",
      env: {
        PORT: process.env.PORT || 3001,
        NODE_ENV: "production",
      },
      instances: 1,
      autorestart: true,
    },
  ],
};
