const DB = require("./databaseController")
const utils = require("../utils/validate")

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

exports.getChartDataItemTypes = async (req, res) => {
    try {
        let chartData = []
        const vendors = await DB.getVendors()
        for await (const ven of vendors) {
            const items = await DB.getItemsByVendor(ven.id)
            chartData.push({
                vendor: ven.name,
                items: items.length
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

exports.getChartDataVendorItemCount = async (req, res) => {
    try {
        let chartData = []
        const vendors = await DB.getVendors()
        for (let i = 0; i < vendors.length; i++) {
            const vendor = vendors[i];
            const items = await DB.getItemsByVendor(vendor.id)
            chartData.push({
                vendor: vendor.name,
                items: items
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

exports.getRestockFormsByVendor = async (req, res) => {
    try {
        const restockForms = await DB.getRestockFormsByVendor(req.params.id)
        res.status(200).json({
            restockForms: restockForms
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}

exports.getAllRestockForms = async (req, res) => {
    try {
        const restockForms = await DB.getAllRestockForms()
        res.status(200).json({
            restockForms: restockForms
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}

exports.getEOMReport = async (req, res) => {
    try {
        const restockReport = await DB.getRestocksByVendorAndCurrentDate(req.body.vendor_id)
        const newReport = await utils.prepareReport(restockReport)


        res.status(200).json({
            restockReport: newReport
        })
        
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}

exports.getItemSalesByVendor = async (req, res) => {
    try {
        const vendorSales = await DB.getItemSalesByVendor(req.params.id)
        res.status(200).json({
            vendorSales: vendorSales
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}

exports.getVendorSales = async (req, res) => {
    try {
        const vendorSalesAll = await DB.getVendorSales(req.params.id)
        res.status(200).json({
            vendorSalesAll: vendorSalesAll
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: error.message,
            cause: error.cause
        })
    }
}