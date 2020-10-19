const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = mongoose.model(
  'User',
  new Schema(
    {
      name: String,
      email: String,
      password: String,
      salt: String,
      phone: String,
      role: { type: String, default: 'user' }, //for User or Admin
      verified: { type: Boolean, default: true },
    },
    { timestamps: true }
  )
);

module.exports = Users;
