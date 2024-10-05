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

exports.getVendor = async (req, res) => {
    try {
        const vendor = await DB.getVendor(req.params.id)
        res.status(200).json({
            vendor: vendor
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}

exports.getItemsByVendor = async (req, res) => {
    try {
        const itemList = await DB.getItemsByVendor(req.params.id)
        res.status(200).json({
            itemList: itemList
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}

exports.getAllItems = async (req, res) => {
    try {
        const allItems = await DB.getAllItems()
        res.status(200).json({
            allItems: allItems
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}

exports.getChartData = async (req, res) => {
    try {
        let chartData = []
        const vendors = await DB.getChartData1()
        for await (const ven of vendors) {
            const itemCount = await DB.getChartData2(ven.id)
            chartData.push({
                vendor: ven.name,
                items: itemCount
            })
        }
        res.status(200).json({
            chartData: chartData
        })
        chartData = null
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}