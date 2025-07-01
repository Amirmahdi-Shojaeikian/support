const express = require('express');
const organizationController = require("../organization/organization.controller");
const {authUserAdmin} =require("../../middlewares/auth.userAdmin")

const router = express.Router();


router.route("/add").post(authUserAdmin,organizationController.add)
router.route("/").get(authUserAdmin,organizationController.getAll)
router.route("/:id").get(authUserAdmin,organizationController.getOne)
router.route("/:id/update").put(authUserAdmin,organizationController.update)
router.route("/:id/delete").delete(authUserAdmin,organizationController.delete)



module.exports = router