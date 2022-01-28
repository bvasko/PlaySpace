const sequelize = require('../config/connection');
const { User, Playlist } = require('../models');
const playlistData = require('./playlistData.json');

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

  process.exit(0);
};

seedDatabase();