const express = require("express");
const path = require("path");
// const userRouter = require("./routes/user.routes");
const sopportRouter = require("./routes/support.routes");
const userAdminRouter = require("./modules/userAdmin/userAdmin.routes");
const routeAccessRouter = require("./modules/routeAccess/routeAccess.route");
const roleRouter = require("./modules/role/role.route");
const organizationRouter = require("./modules/organization/organization.route");
const userRouter = require("./modules/user/user.route");
const departmentRouter = require("./modules/department/department.route");
const ticketRouter = require("./modules/ticket/ticket.route");
const messageticketRouter = require("./modules/messageTicket/messageTicket.route");

const app = express();

//* BodyParser
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

//* CORS Policy


//* Static Folder
app.use(express.static(path.join(__dirname, "public")));

//* Routes
app.use("/v1/auth", userRouter);
app.use("/v1/auth", sopportRouter);
app.use("/v1/userAdmin", userAdminRouter);
app.use("/v1/route", routeAccessRouter);
app.use("/v1/role", roleRouter);
app.use("/v1/organization", organizationRouter);
app.use("/v1/user", userRouter);
app.use("/v1/department", departmentRouter);
app.use("/v1/ticket", ticketRouter);

//* 404 Error handler

module.exports = app;
