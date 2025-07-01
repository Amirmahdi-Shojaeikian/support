const express = require('express');
const routeAccessController = require("./../routeAccess/routeAccess.controller");
const {authUserAdmin} =require("../../middlewares/auth.userAdmin")
const {authUserIntenal} =require("../../middlewares/auth.userIntenal")

const router = express.Router();

router.route("/organization").get(authUserIntenal,routeAccessController.getAllOrganization)

router.route("/").get(authUserAdmin,routeAccessController.getAll)
router.route("/add").post(authUserAdmin,routeAccessController.add)
router.route("/:id").get(authUserAdmin,routeAccessController.getOne)
router.route("/:id/update").put(authUserAdmin,routeAccessController.update)
router.route("/:id/delete").delete(authUserAdmin,routeAccessController.delete)





module.exports = router