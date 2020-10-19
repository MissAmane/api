const jwt = require('jsonwebtoken');
const Users = require('../models/Users');

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.sendStatus(403);
  }
  jwt.verify(token, process.env.MANSION_SECRET, (err, decoded) => {
    const { _id } = decoded;
    Users.findOne({ _id }, { email: 1, name: 1, role: 1, verified: 1 })
      .exec()
      .then((user) => {
        req.user = user;
        next();
      });
  });
};

const hasRoles = (roles) => (req, res, next) => {
  if (roles.indexOf(req.user.role) > -1) {
    return next();
  }
  res.sendStatus(403);
};

module.exports = {
  isAuthenticated,
  hasRoles,
};
