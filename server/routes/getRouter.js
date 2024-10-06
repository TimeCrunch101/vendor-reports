const express = require("express");
const getController = require("../controllers/getController");
const auth = require("../controllers/authController")
const getRouter = express.Router();

const initGetRouter = (app) => {

  getRouter.get("/api/v1/secret", auth.isAuthenticated ,getController.secretRouteTest)
  getRouter.get("/api/v1/validate", auth.isAuthenticated , auth.validate)
  getRouter.get("/api/v1/get/vendors", auth.isAuthenticated , getController.getVendors)
  getRouter.get("/api/v1/get/vendor/:id", auth.isAuthenticated , getController.getVendor)
  getRouter.get("/api/v1/get/items-by-vendor/:id", auth.isAuthenticated , getController.getItemsByVendor)
  getRouter.get("/api/v1/get/items", auth.isAuthenticated , getController.getAllItems)
  getRouter.get("/api/v1/get/chart-data/item-types", auth.isAuthenticated, getController.getChartDataItemTypes)
  getRouter.get("/api/v1/get/chart-data/item-count", auth.isAuthenticated, getController.getChartDataVendorItemCount)
  getRouter.get("/api/v1/get/restock-forms/by-vendor/:id", auth.isAuthenticated, getController.getRestockFormsByVendor)
  getRouter.get("/api/v1/get/restock-forms", auth.isAuthenticated, getController.getAllRestockForms)

  return app.use("/", getRouter);
};

module.exports = initGetRouter;