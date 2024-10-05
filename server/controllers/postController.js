const DB = require("./databaseController.js")
const validate = require("../utils/validate.js")
const auth = require('./authController.js')

exports.register = async (req, res) => {
    // TODO: Remove trailing spaces from user input
    try {
    await validate.checkUserFields({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
    })
    await DB.checkIfEmailExists(req.body.email)
    const hash = await auth.hashPassword(req.body.password)
    await DB.register({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hash,
    })
    res.status(201).json({
        message: "User registered successfully"
    })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}

exports.login = async (req, res) => {
    try {
        const userFromDB = await DB.getUserByEmail(req.body.email)
        const passMatch = await auth.checkPassword(req.body.password, userFromDB.password)
        if (!passMatch) throw new Error("Could not log you in", {cause: "Incorrect Password"})
        const token = await auth.createJWT(userFromDB)
        res.status(200).json({
            id: userFromDB.id,
            first_name: userFromDB.first_name,
            last_name: userFromDB.last_name,
            full_name: userFromDB.full_name,
            email: userFromDB.email,
            token: token,
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}

exports.addVendor = async (req, res) => {
    try {
        const dbRes = await DB.addVendor(req.body)
        res.status(200).json({
            dbRes: dbRes
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}

exports.deleteVendor = async (req, res) => {
    try {
        const dbRes = await DB.deleteVendor(req.params.id)
        res.status(200).json({
            dbRes: dbRes
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}

exports.addItemToVendor = async (req, res) => {
    try {
        const dbRes = await DB.addItemToVendor(req.params.id, req.body)
        res.status(200).json({
            dbRes: dbRes
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}

exports.deleteItem = async (req, res) => {
    try {
        const dbRes = await DB.deleteItem(req.params.id)
        res.status(200).json({
            dbRes: dbRes
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}

exports.submitRestockForm = async (req, res) => {
    try {
        for (let i = 0; i < req.body.restockForm.length; i++) {
            const itemRestock = req.body.restockForm[i];
            await DB.submitRestockForm(req.params.vendor_id, itemRestock)
        }
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}