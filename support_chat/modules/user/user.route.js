const express = require('express');
const userController = require("../user/user.controller");
const {authUserIntenal} =require("../../middlewares/auth.userIntenal")
const {authUserExternal} =require("../../middlewares/auth.userExternal")

const router = express.Router();

router.route("/login/internal").post(userController.loginIntenal)
router.route("/internal/add").post(authUserIntenal,userController.addInternal)
router.route("/internal/").get(authUserIntenal,userController.getAllInternal)
router.route("/internal/:id").get(authUserIntenal,userController.getOneInternal)
router.route("/internal/:id/update").put(authUserIntenal,userController.updateInternal)
router.route("/internal/:id/delete").delete(authUserIntenal,userController.deleteInternal)



router.route("/external/register").post(userController.registerExternal)
router.route("/external/login").post(userController.loginExternal)
router.route("/external/").get(authUserExternal,userController.getOneExternal)
router.route("/external/:id/update").put(authUserExternal,userController.updateExternal)



module.exports = router