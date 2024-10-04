const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ERROR_MESSAGES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then(() => res.status(201).send({ name, avatar, email }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(ERROR_MESSAGES.BAD_REQUEST));
      }
      if (err.code === 11000) {
        next(new ConflictError(ERROR_MESSAGES.DUPLICATE));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError(ERROR_MESSAGES.CAST_ERROR));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) =>
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
      }
      if (err.name === "CastError") {
        next(new BadRequestError(ERROR_MESSAGES.CAST_ERROR));
      }
      next(err);
    });

module.exports.updateProfile = (req, res, next) =>
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, avatar: req.body.avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError(ERROR_MESSAGES.CAST_ERROR));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
      }
      if (err.name === "CastError") {
        next(new BadRequestError(ERROR_MESSAGES.CAST_ERROR));
      }
      next(err);
    });
