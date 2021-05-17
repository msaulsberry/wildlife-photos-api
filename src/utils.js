const SQL = require('sequelize');

module.exports.createStore = () => {
  const Op = SQL.Op;
  const operatorsAliases = {
    $in: Op.in,
  };

  const db = new SQL('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './store.sqlite',
    operatorsAliases,
    logging: false,
  });

  const users = db.define('users', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    authId: SQL.STRING,
    createdAt: { type: SQL.DATE, allowNull: false, defaultValue: SQL.NOW },
    email: SQL.STRING,
    first: SQL.STRING,
    last: SQL.STRING,
  });

  const species = db.define('species', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    commonName: SQL.STRING,
    scientificName: SQL.STRING,
    funFact: SQL.STRING,
    createdAt: SQL.DATE,
    createdByuserId: SQL.INTEGER,
  });

  const locations = db.define('locations', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    country: SQL.STRING,
    description: SQL.STRING,
    createdAt: SQL.DATE,
    createdByuserId: SQL.INTEGER,
  });

  const photos = db.define('photos', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    link: SQL.STRING,
    description: SQL.STRING,
    isPrivate: SQL.STRING,
    createdAt: SQL.DATE,
    createdByuserId: SQL.INTEGER,
  });

  return { users, species, locations, photos };
};