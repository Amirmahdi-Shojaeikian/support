const express = require("express");
const userController = require("../controllers/user");
const { multerStorage } = require("../middlewares/multer");

const router = express.Router();


router.post("/login/user", userController.loginUser);

module.exports = router;
