const express = require('express');
const ticketController = require("../ticket/ticket.controller");
const {authUserAdmin} =require("../../middlewares/auth.userAdmin")
const {authUserIntenal} =require("../../middlewares/auth.userIntenal")
const {authUserExternal} =require("../../middlewares/auth.userExternal")

const router = express.Router();


router.route("/external/add").post(authUserExternal,ticketController.addExternal)
router.route("/external/").get(authUserExternal,ticketController.getAllExternal)
router.route("/external/:id").get(authUserExternal,ticketController.getOneExternal)
router.route("/external/:id/update").put(authUserExternal,ticketController.updateExternal)


router.route("/internal/").get(authUserIntenal,ticketController.getAllIntenal)
router.route("/internal/unassigned").get(authUserIntenal,ticketController.getAll)
router.route("/internal/:id").get(authUserIntenal,ticketController.getOneIntenal)
router.route("/internal/accept").post(authUserExternal,ticketController.acceptInternal)
router.route("/internal/:id/update").put(authUserIntenal,ticketController.updateIntenal)


module.exports = router