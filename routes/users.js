const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateProfileEdit } = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateProfileEdit, updateProfile);

module.exports = router;
