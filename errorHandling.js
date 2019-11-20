exports.routeNotExist = (req, res, next) => {
  res.status(404).send({ msg: "route does not exist" });
};

exports.badRequest = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.notFound = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
};

exports.noContent = (err, req, res, next) => {
  if (err.status === 204) {
    console.log(err.status);
    res.status(404).send({ msg: "Not Found" });
    res.status(204).send({ msg: "No Content" });
  } else {
    next(err);
  }
};

exports.unprocessableEntity = (err, req, res, next) => {
  if (err.status === 422) {
    res.status(422).send({ msg: "Unprocessable Entity" });
  }
};

exports.serverError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
