const express = require('express');
const departmentController = require("../department/department.controller");
const {authUserAdmin} =require("../../middlewares/auth.userAdmin")
const {authUserIntenal} =require("../../middlewares/auth.userIntenal")

const router = express.Router();


router.route("/add").post(authUserIntenal,departmentController.add)
router.route("/").get(authUserIntenal,departmentController.getAll)
router.route("/:id").get(authUserIntenal,departmentController.getOne)
router.route("/:id/update").put(authUserIntenal,departmentController.update)
router.route("/:id/delete").delete(authUserIntenal,departmentController.delete)



module.exports = router