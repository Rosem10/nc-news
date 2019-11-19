const connection = require("../db/connection");

const getAllTopics = () => {
  return connection.select("*").from("topics");
};

module.exports = getAllTopics;
