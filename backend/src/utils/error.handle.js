const handleHttp = (res, code, error) => {
  res.status(code);
  res.send({ error });
};

module.exports = { handleHttp };
