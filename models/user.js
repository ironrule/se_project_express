const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");
const ForbiddenError = require("../errors/forbidden-err");
const UnauthorizedError = require("../errors/unauthorized-err");
const { ERROR_MESSAGES } = require("../utils/errors");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name field is required."],
    minlength: 2,
    maxlength: 30,
    message: "You must enter a name for this item",
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "Valid email address is required."],
    unique: true,
    message: "You must enter a valid email address.",
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
    },
  },
  password: {
    type: String,
    required: [true, "Valid strong password is required."],
    validate: {
      validator(value) {
        return validator.isStrongPassword(value);
      },
    },
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
  next
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND);
      }
      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND);
          }
          return user;
        })
        .catch(next);
    });
};

module.exports = mongoose.model("user", userSchema);
