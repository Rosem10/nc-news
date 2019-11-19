const getUserById = require("../models/usersModel");

const sendUserById = (req, res, next) => {
  const username = req.params.username;
  getUserById(username)
    .then(user => {
      if (!user) {
        return Promise.reject({
          status: 400,
          msg: "Bad Request"
        });
      }
      res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = sendUserById;
