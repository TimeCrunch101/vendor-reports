const express = require('express')
const postController = require('../controllers/postController')
const auth = require("../controllers/authController")
const postRouter = express.Router();

const initPostRouter = (app) => {

    postRouter.post("/api/v1/register", auth.isNotAuthenticated, postController.register)
    postRouter.post("/api/v1/login", auth.isNotAuthenticated, postController.login)

    return app.use('/', postRouter);
}

module.exports = initPostRouter