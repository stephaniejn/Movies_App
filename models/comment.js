"use strict";

module.exports = function(sequelize, DataTypes) {
  var comment = sequelize.define("comment", {
    text: DataTypes.STRING,
    watchId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.comment.belongsTo(models.watch)
        // associations can be defined here
      }
    }
  });

  return comment;
};
