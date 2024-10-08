const express = require("express");
const getController = require("../controllers/getController");
const auth = require("../controllers/authController")
const getRouter = express.Router();

const initGetRouter = (app) => {

  getRouter.get("/api/v1/alive", getController.alive)
  getRouter.get("/api/v1/validate", auth.isAuthenticated , auth.validate)
  getRouter.get("/api/v1/get/vendors", auth.isAuthenticated , getController.getVendors)
  getRouter.get("/api/v1/get/vendor/:id", auth.isAuthenticated , getController.getVendor)
  getRouter.get("/api/v1/get/items-by-vendor/:id", auth.isAuthenticated , getController.getItemsByVendor)
  getRouter.get("/api/v1/get/items", auth.isAuthenticated , getController.getAllItems)
  getRouter.get("/api/v1/get/chart-data/item-types", auth.isAuthenticated, getController.getChartDataItemTypes)
  getRouter.get("/api/v1/get/chart-data/item-count", auth.isAuthenticated, getController.getChartDataVendorItemCount)
  getRouter.get("/api/v1/get/restock-forms/by-vendor/:id", auth.isAuthenticated, getController.getRestockFormsByVendor)
  getRouter.get("/api/v1/get/restock-forms", auth.isAuthenticated, getController.getAllRestockForms)
  getRouter.post("/api/v1/get/vendor/eom-report", auth.isAuthenticated, getController.getEOMReport)
  getRouter.get("/api/v1/get/sales-by-vendor/:id", auth.isAuthenticated, getController.getItemSalesByVendor)
  getRouter.get("/api/v1/get/sales/:id", auth.isAuthenticated, getController.getVendorSales)

  return app.use("/", getRouter);
};

module.exports = initGetRouter;