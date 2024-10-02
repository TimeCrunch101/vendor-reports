const DB = require("./databaseController")

exports.secretRouteTest = async (req, res) => {
    console.log(res.user)
    res.send("SECRETE!!!")
}