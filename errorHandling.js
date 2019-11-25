exports.methodNotAllowed = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};
exports.routeNotExist = (req, res, next) => {
  res.status(404).send({ msg: "route does not exist" });
};

exports.psqlErrors = (err, req, res, next) => {
  const codes = {
    "22P02": { status: 400, msg: "Bad Request" },
    "23502": { status: 400, msg: "Bad Request" },
    "23503": { status: 404, msg: "Not Found" },
    "42703": { status: 400, msg: "Bad Request" }
  };
  if (codes[err.code]) {
    res.status(codes[err.code].status).send({ msg: codes[err.code].msg });
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
    res.status(404).send({ msg: "Not Found" });
    res.status(204).send({ msg: "No Content" });
  } else {
    next(err);
  }
};

exports.unprocessableEntity = (err, req, res, next) => {
  if (err.status === 422) {
    res.status(422).send({ msg: "Unprocessable Entity" });
  } else next(err);
};

exports.serverError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
