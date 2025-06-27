const express = require('express');
const roleController = require("../role/role.controller");
const {authUserAdmin} =require("../../middlewares/auth.userAdmin")

const router = express.Router();


router.route("/add").post(authUserAdmin,roleController.add)
router.route("/").get(authUserAdmin,roleController.getAll)
router.route("/:id").get(authUserAdmin,roleController.getOne)
router.route("/:id/update").put(authUserAdmin,roleController.update)
router.route("/:id/delete").delete(authUserAdmin,roleController.delete)



module.exports = router