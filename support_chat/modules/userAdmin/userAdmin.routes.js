const express = require('express');
const userAdminController = require("./../userAdmin/userAdmin.controller");
const {auth} =require("../../middlewares/auth")
const {authUserAdmin} =require("../../middlewares/auth.userAdmin")

const router = express.Router();


router.route("/token").get(authUserAdmin,userAdminController.getOneBytoken)
router.route("/add").post(authUserAdmin,userAdminController.add)
router.route("/").get(authUserAdmin,userAdminController.getAll)
router.route("/:id").get(authUserAdmin,userAdminController.getOne)
router.route("/:id/update").put(authUserAdmin,userAdminController.update)
router.route("/:id/delete").delete(authUserAdmin,userAdminController.delete)

router.route("/login").post(userAdminController.login)
router.route("/register").post(userAdminController.register)




module.exports = router
