const express = require("express");
const supportController = require("../controllers/support");
const { multerStorage } = require("../middlewares/multer");

const router = express.Router();

const uploader = multerStorage("public/rooms");

router.post("/register/support", supportController.register);
router.post("/login/support", supportController.login);


module.exports = router;
