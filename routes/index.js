const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use("/users", auth, userRouter);
router.use("/signup", createUser);
router.use("/signin", login);
router.use("/items", clothingItemRouter);
router.use((req, res) => {
  res
    .status(ERROR_CODES.NOT_FOUND)
    .send({ message: ERROR_MESSAGES.INVALID_ROUTE });
});

module.exports = router;
