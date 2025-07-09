const express = require('express');
const messageTicketController = require("../messageTicket/messageTicket.controller");
const {authUserAdmin} =require("../../middlewares/auth.userAdmin")
const {authUserIntenal} =require("../../middlewares/auth.userIntenal")
const {authUserExternal} =require("../../middlewares/auth.userExternal")

const router = express.Router();


router.route("/external/add").post(authUserExternal,messageTicketController.addExternal)

router.route("/internal/add").post(authUserIntenal,messageTicketController.addInternal)

router.route("/:id/external/update").post(authUserExternal,messageTicketController.updateExternal)

router.route("/:id/internal/update").post(authUserIntenal,messageTicketController.updateInternal)

module.exports = router