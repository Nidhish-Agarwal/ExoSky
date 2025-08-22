const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  bio: {
    type: String
  },
  refreshToken: {
    type: String,
    select: false,
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('User', UserSchema);