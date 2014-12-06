"use strict";

module.exports = function(sequelize, DataTypes) {
  var Watch = sequelize.define("Watch", {
    imdb_code: DataTypes.STRING,
    title: DataTypes.STRING,
    year: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return Watch;
};
