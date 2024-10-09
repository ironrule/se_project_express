const express = require("express");
const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { ERROR_MESSAGES } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");
const NotFoundError = require("../errors/not-found-err");
const { validateLogin, validateUser } = require("../middlewares/validation");

router.use("/users", auth, userRouter);
router.use("/signup", validateUser, createUser);
router.use("/signin", validateLogin, login);
router.use("/items", clothingItemRouter);
router.use((req, res, next) => {
  next(new NotFoundError(ERROR_MESSAGES.INVALID_ROUTE));
});

module.exports = router;
