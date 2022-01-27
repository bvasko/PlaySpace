module.exports = function(sequelize, DataTypes) {
  var Playlist = sequelize.define('Playlist', {
    name: DataTypes.STRING,
    creatorID: DataTypes.STRING,
    upvotes: DataTypes.INTEGER,
    comments: DataTypes.INTEGER,
    views: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    favoritedBy: DataTypes.STRING,
  });

  Playlist.associate = function(models) {
    // playlist belongs to Many
  };

  return Playlist;
};