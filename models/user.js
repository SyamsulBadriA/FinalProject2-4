'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Photo);
      this.hasMany(models.Comment);
      this.hasMany(models.SocialMedia);
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Full Name Is Required'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Email has been Registered'
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Valid Email is Required'
        },
        notEmpty: {
          args: true,
          msg: 'Email Is Required'
        }
      },
    },
    username: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Username Already Taken"
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Username Is Required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Passowrd Is Required'
        }
      }
    },
    profile_image_url: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Profile Image URL Is Required'
        },
        isUrl: {
          args: true,
          msg: 'Valid URL is Required'
        }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Age Is Required'
        },
        isNumeric: {
          args: true,
          msg: 'Age Is Required'
        }
      }
    },
    phone_number: {
      type: DataTypes.BIGINT,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Phone Number Is Required'
        },
        isNumeric: {
          args: true,
          msg: 'Phone Number Is Required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};