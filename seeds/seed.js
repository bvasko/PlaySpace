const sequelize = require('../config/connection');
const { User, Playlist, Comment  } = require('../models');
const playlistData = require('./playlistData.json');
const commentData = require('./commentData.json');

const userData = require('./userData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for(const playlist of playlistData) {
    await Playlist.create({
      ...playlist
    });
  }

  for(const comment of commentData) {
    await Comment.create({
      ...comment
    });
  }

  process.exit(0);
};

seedDatabase();