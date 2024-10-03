const DB = require("./databaseController")

exports.secretRouteTest = async (req, res) => {
    console.info(res.user)
    res.send("SECRETE!!!")
}

exports.getVendors = async (req, res) => {
    try {
        const vendors = await DB.getVendors()
        res.status(200).json({
            vendors: vendors
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}