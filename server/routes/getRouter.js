const express = require("express");
const getController = require("../controllers/getController");
const auth = require("../controllers/authController")
const getRouter = express.Router();

const initGetRouter = (app) => {

  getRouter.get("/api/v1/secret", auth.isAuthenticated ,getController.secretRouteTest)
  getRouter.get("/api/v1/validate", auth.isAuthenticated , auth.validate)

  return app.use("/", getRouter);
};

module.exports = initGetRouter;