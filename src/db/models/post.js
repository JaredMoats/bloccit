"use strict";
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define(
    "Post",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false
      },
      topicId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });
    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Post.hasMany(models.Flair, {
      foreignKey: "postId",
      as: "flairs"
    });
    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments"
    });
    Post.hasMany(models.Vote, {
      foreignKey: "postId",
      as: "votes"
    });
    Post.hasMany(models.Favorite, {
      foreignKey: "postId",
      as: "favorites"
    });
    Post.afterCreate((post, callback) => {
      return models.Favorite.create({
        userId: post.userId,
        postId: post.id
      });
    });
    Post.afterCreate((post, callback) => {
      return models.Vote.create({
        value: 1,
        userId: post.userId,
        postId: post.id
      });
    });
  };
  Post.prototype.getPoints = function() {
    const votes = this.getVotes();

    if (votes.length === 0) {
      return 0;
    }
    return votes
      .map(v => {
        return v.value;
      })
      .reduce((prev, next) => {
        return prev + next;
      });
  };
  Post.prototype.hasUpvoteFor = function(userId) {
    return this.getVotes({ where: { userId, postId: this.id, value: 1 } }).then(
      votes => {
        if (votes.length > 0) {
          return true;
        } else {
          return false;
        }
      }
    );
  };
  Post.prototype.hasDownvoteFor = function(userId) {
    return this.getVotes({
      where: { userId, postId: this.id, value: -1 }
    }).then(votes => {
      if (votes.length > 0) {
        return true;
      } else {
        return false;
      }
    });
  };
  Post.prototype.getFavoriteFor = function(userId) {
    return this.favorites.find(favorite => {
      return favorite.userId == userId;
    });
  };
  Post.addScope("lastFiveFor", userId => {
    return {
      where: { userId: userId },
      limit: 5,
      order: [["createdAt", "DESC"]]
    };
  });
  return Post;
};
