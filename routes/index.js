const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { ERROR_MESSAGES } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");
const NotFoundError = require("../errors/not-found-err");

router.use("/users", auth, userRouter);
/**============================================
 **               Crash Test
 *=============================================**/
const express = require("express");
const app = express();
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
// ============================================
router.use("/signup", createUser);
router.use("/signin", login);
router.use("/items", clothingItemRouter);
router.use((req, res, next) => {
  next(new NotFoundError(ERROR_MESSAGES.INVALID_ROUTE));
});

module.exports = router;
