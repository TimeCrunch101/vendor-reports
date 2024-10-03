const express = require('express')
const postController = require('../controllers/postController')
const auth = require("../controllers/authController")
const postRouter = express.Router();

const initPostRouter = (app) => {

    postRouter.post("/api/v1/register", auth.isNotAuthenticated, postController.register)
    postRouter.post("/api/v1/login", auth.isNotAuthenticated, postController.login)
    postRouter.post("/api/v1/add/vendor", auth.isAuthenticated, postController.addVendor)
    postRouter.post("/api/v1/delete/vendor/:id", auth.isAuthenticated, postController.deleteVendor)

    return app.use('/', postRouter);
}

module.exports = initPostRouter