exports.routeNotExist = (req, res, next) => {
  res.status(404).send({ msg: "route does not exist" });
};

exports.psqlErrors = (err, req, res, next) => {
  console.log(err);
  const codes = {
    "22P02": { status: 400, msg: "Bad Request" },
    "23502": { status: 404, msg: "Not Found" }
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
