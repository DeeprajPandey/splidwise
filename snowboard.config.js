const { resolve } = require("path");

module.exports = {
  html: {
    playground: {
      enabled: true,
      env: "development",
      environments: {
        development: {
          url: "http://localhost:6401/",
        },
        staging: {
          url: "https://fathomless-fortress-82121.herokuapp.com",
        }
      }
    }
  }
};