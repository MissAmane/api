const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const { isAuthenticated } = require('../auth');
const router = express.Router();

const signToken = (_id) => {
  return jwt.sign({ _id }, process.env.MANSION_SECRET, {
    expiresIn: 60 * 60 * 24 * 1, // sec * min * hours * days
  });
};

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  crypto.randomBytes(16, (err, salt) => {
    const newSalt = salt.toString('base64');
    crypto.pbkdf2(password, newSalt, 1000, 64, 'sha1', (err, key) => {
      const encryptedPassword = key.toString('base64');
      Users.findOne({ email })
        .exec()
        .then((user) => {
          if (user) {
            return res.status(401).json({
              status: 401,
              data: null,
              message: 'Usuario ya existe',
            });
          }
          Users.create({
            name,
            email,
            password: encryptedPassword,
            salt: newSalt,
          }).then(() => {
            return res.status(201).json({
              status: 201,
              data: null,
              message: 'Usuario creado con exito',
            });
          });
        });
    });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  Users.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          status: 401,
          data: null,
          message: 'usuario y/o constraseña incorrectos',
        });
      }
      crypto.pbkdf2(password, user.salt, 1000, 64, 'sha1', (err, key) => {
        const encryptedPassword = key.toString('base64');
        if (user.password === encryptedPassword) {
          const token = signToken(user._id);
          return res.status(200).json({
            status: 200,
            token,
          });
        }
        return res.status(401).json({
          status: 401,
          data: null,
          message: 'usuario y/o constraseña incorrectos',
        });
      });
    });
});

router.get('/me', isAuthenticated, (req, res) => {
  res.send(req.user);
});

module.exports = router;
