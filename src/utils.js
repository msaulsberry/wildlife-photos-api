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

  const Users = db.define('users', {
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

  const Species = db.define('species', {
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
  
  const Locations = db.define('locations', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: SQL.STRING,
    country: SQL.STRING,
    description: SQL.STRING,
    createdAt: SQL.DATE,
    createdByuserId: SQL.INTEGER,
  });

  const Photos = db.define('photos', {
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
  Photos.belongsToMany(Species, { through: 'SpeciesPhotos' }); //create join table
  Species.belongsToMany(Photos, { through: 'SpeciesPhotos' });

  Locations.hasMany(Photos);
  Photos.belongsTo(Locations);

  return { Users, Species, Locations, Photos };
};