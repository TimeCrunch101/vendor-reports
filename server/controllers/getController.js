const DB = require("./databaseController")

exports.secretRouteTest = async (req, res) => {
    console.info(res.user)
    res.send("SECRETE!!!")
}