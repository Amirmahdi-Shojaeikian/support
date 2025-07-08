const express = require('express');
const messageTicketController = require("../messageTicket/messageTicket.controller");
const {authUserAdmin} =require("../../middlewares/auth.userAdmin")
const {authUserIntenal} =require("../../middlewares/auth.userIntenal")
const {authUserExternal} =require("../../middlewares/auth.userExternal")

const router = express.Router();


router.route("/external/add").post(authUserExternal,messageTicketController.addExternal)

router.route("/internal/add").post(authUserIntenal,messageTicketController.addInternal)

module.exports = router