const connection = require("../db/connection");

const getUserById = username => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .first();
};

module.exports = getUserById;
