// import models
const User = require('./User');
const Playlist = require('./Playlist');
const Comment = require('./Comment');

User.hasMany(Playlist, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
})

Playlist.belongsTo(User, {
  foreignKey: 'user_id'
})

Playlist.hasMany(Comment, {
  foreignKey: 'playlist_id',
  onDelete: 'CASCADE'
});

Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

Comment.belongsTo(Playlist, {
  foreignKey: 'playlist_id'
});

module.exports = {
  User,
  Playlist,
};