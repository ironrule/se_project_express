const ClothingItem = require("../models/clothingItem");
const { ERROR_MESSAGES } = require("../utils/errors");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");
const UnauthorizedError = require("../errors/unauthorized-err");

module.exports.getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      next(err);
    });
};

module.exports.createClothingItem = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;
  ClothingItem.create({ name, imageUrl, weather, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError(ERROR_MESSAGES.CAST_ERROR));
      }
      next(err);
    });
};

module.exports.deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.send({ message: "Item successfully deleted." })
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "Unauthorized") {
        next(new UnauthorizedError(ERROR_MESSAGES.NOT_AUTHORIZED));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
      }
      if (err.name === "CastError") {
        next(new BadRequestError(ERROR_MESSAGES.CAST_ERROR));
      }
      next(err);
    });
};

module.exports.likeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.json(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
      }
      if (err.name === "CastError") {
        next(new BadRequestError(ERROR_MESSAGES.CAST_ERROR));
      }
      next(err);
    });

module.exports.dislikeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
      }
      if (err.name === "CastError") {
        next(new BadRequestError(ERROR_MESSAGES.CAST_ERROR));
      }
      next(err);
    });
