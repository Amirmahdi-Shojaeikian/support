const express = require('express');
const roleController = require("../role/role.controller");
const {authUserAdmin} =require("../../middlewares/auth.userAdmin")
const {authUserIntenal} =require("../../middlewares/auth.userIntenal")

const router = express.Router();

router.route("/organization/add").post(authUserIntenal,roleController.addInternal)
router.route("/organization/").get(authUserIntenal,roleController.getAllInternal)
router.route("/:id/organization/").get(authUserIntenal,roleController.getOneInternal)
router.route("/:id/organization/update").put(authUserIntenal,roleController.updateInternal)
router.route("/:id/organization/delete").delete(authUserIntenal,roleController.deleteInternal)

router.route("/add").post(authUserAdmin,roleController.add)
router.route("/").get(authUserAdmin,roleController.getAll)
router.route("/:id").get(authUserAdmin,roleController.getOne)
router.route("/:id/update").put(authUserAdmin,roleController.update)
router.route("/:id/delete").delete(authUserAdmin,roleController.delete)



module.exports = router