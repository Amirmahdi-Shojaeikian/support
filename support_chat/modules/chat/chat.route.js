const express = require('express');
const chatController = require("../chat/chat.controller");
const {authUserIntenal} =require("../../middlewares/auth.userIntenal")
const {authUserExternal} =require("../../middlewares/auth.userExternal")

const router = express.Router();

router.route("/internal/").get(authUserIntenal,chatController.getAllInternal)
router.route("/external/").get(authUserExternal,chatController.getAllExternal)

router.route("/external/add").post(authUserExternal,chatController.addExternal)
// router.route("/external/:id/update").put(authUserExternal,chatController.updateExternal)


router.route("/internal/add").post(authUserIntenal,chatController.addInternal)
router.route("/internal/:id/update").put(authUserIntenal,chatController.updateIntenal)


module.exports = router