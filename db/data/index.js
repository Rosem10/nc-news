const ENV = process.env.NODE_ENV || "development";

const developmentData = require("./development-data");
const testData = require("./test-data");

const data = {
  test: testData,
  development: developmentData,
  production: developmentData
};

module.exports = data[ENV];
