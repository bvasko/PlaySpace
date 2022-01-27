const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
  checkPassword(loginPw){
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    id:
    name:
    email:
    password:
  },
  {
    hooks: {},
    sequelize,
    timestamps,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
  }
);

module.exports = User;