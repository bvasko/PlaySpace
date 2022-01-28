// import models
const User = require('./User');
const Playlist = require('./Playlist');

User.hasMany(Playlist, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
})

Playlist.belongsTo(User, {
  foreignKey: 'user_id'
})

module.exports = {
  User,
  Playlist,
};