const { DB } = require("../config/db")
const { v4: uuidv4 } = require('uuid');

/**
 * @param {Object} user The user Object
 * @param {String} user.first_name The users First Name
 * @param {String} user.last_name The users Last Name
 * @param {String} user.email The users email to register with
 * @param {String} user.password The users password
 * @returns True if the user was successfully added to the DB.
 */

exports.register = (user) => {
    return new Promise((resolve, reject) => {
        DB.query("INSERT INTO users SET ?", {
            id: uuidv4(),
            username: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            password: user.password
        }, (err, res) => {
            try {
                if (err) throw new Error("Could not register user", {cause: err.message})
                    resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    })
}

/**
 * @param {String} email 
 * @returns True if the email does not exist. Returns an Error if the email does exist.
 */

exports.checkIfEmailExists = (email) => {
    return new Promise((resolve, reject) => {
        DB.query("SELECT email FROM users WHERE email = ?",[email], (err, emailFromDb) => {
            try {
                if (err) throw new Error("Could not fetch Email.", {cause: err.message})
                if (emailFromDb.length > 0) throw new Error("That email is already registered")
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    })
}

/**
 * @param {String} email 
 * @returns The user Object
 */

exports.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        DB.query("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
            try {
                if (err) throw new Error("Could not get user from DB", {cause: err.message})
                if (user.length === 0) throw new Error("Email not found")
                resolve(user[0])
            } catch (error) {
                reject(error)
            }
        })
    })
}

/**
 * @param {Object} vendor 
 * @param {String} vendor.name
 * @param {String} vendor.consignment
 * @param {String} vendor.bm_ven_code
 */

exports.addVendor = (vendor) => {
    return new Promise((resolve, reject) => {
        DB.query("INSERT INTO vendors SET ?", {
            id: uuidv4(),
            poc: null,
            name: vendor.name,
            consignment: vendor.consignment,
            bm_ven_code: vendor.bm_ven_code
        }, (err, res) => {
            try {
                if (err) throw err;
                resolve(res)
            } catch (error) {
                reject(error)
            }
        })
    })
}

exports.getVendors = () => {
    return new Promise((resolve, reject) => {
        DB.query("SELECT * FROM vendors", (err, vendors) => {
            try {
                if (err) throw err;
                resolve(vendors)
            } catch (error) {
                reject(error)
            }
        })
    })
}

exports.deleteVendor = (id) => {
    return new Promise((resolve, reject) => {
        DB.query("DELETE FROM vendors WHERE id = ?", [id], (err, res) => {
            try {
                if (err) throw err;
                resolve(res)
            } catch (error) {
                reject(error)
            }
        })
    })
}

exports.getVendor = (id) => {
    return new Promise((resolve, reject) => {
        DB.query("SELECT * FROM vendors WHERE id = ?", [id], (err, vendor) => {
            try {
                if (err) throw err;
                resolve(vendor[0])
            } catch (error) {
                reject(error)
            }
        })
    })
}

exports.getItemsByVendor = (id) => {
    return new Promise((resolve, reject) => {
        DB.query("SELECT * FROM items WHERE vendor = ?", [id], (err, itemList) => {
            try {
                if (err) throw err;
                resolve(itemList)
            } catch (error) {
                reject(error)
            }
        })
    })
}

exports.addItemToVendor = (vendorID, item) => {
    return new Promise((resolve, reject) => {
        DB.query("INSERT INTO items SET ?", {
            id: uuidv4(),
            item_name: item.item_name,
            price: item.price,
            isbn: item.isbn,
            qty: item.qty,
            vendor: vendorID
        }, (err, res) => {
            try {
                if (err) throw err;
                resolve(res)
            } catch (error) {
                reject(error)
            }
        })
    })
}

exports.deleteItem = (id) => {
    return new Promise((resolve, reject) => {
        DB.query("DELETE FROM items WHERE id = ?",[id], (err, res) => {
            try {
                if (err) throw err;
                resolve(res)
            } catch (error) {
                reject(error)
            }
        })
    })
}

exports.getAllItems = () => {
    return new Promise((resolve, reject) => {
        DB.query(`
            SELECT
                items.id,
                items.item_name,
                items.price,
                items.qty,
                vendors.id AS vendor_id,
                vendors.name AS vendor_name,
                vendors.consignment,
                vendors.bm_ven_code,
                items.isbn
            FROM
                items
                LEFT JOIN vendors ON items.vendor = vendors.id
                ORDER BY vendors.name ASC
            `,[],(err, res) => {
                try {
                    if (err) throw err;
                    resolve(res)
                } catch (error) {
                    reject(error)
                }
            })
    })
}

/**
 * @param {Object} item The Item Object
 * @param {String} item.id The ID of the Item
 * @param {String} item.restockCount The amount of items to be restocked
 * @param {String} item.restockDate The date the restock occurred
 * @param {String} vendor_id The ID for the Vendor that owns the Item
 * @returns The DB response object if the call was successful. Or and Error if something went wrong
 */

exports.submitRestockForm = (vendor_id, item) => {
    return new Promise((resolve, reject) => {
        DB.query("INSERT INTO restocks SET ?", {
            id: uuidv4(),
            item: item.id,
            restock_qty: item.restockCount,
            date: item.restockDate,
            vendor_id: vendor_id
        }, (err, res) => {
            try {
                if (err) throw err;
                resolve(res)
            } catch (error) {
                reject(error)
            }
        })        

    })
}

exports.getRestockFormsByVendor = (id) => {
    return new Promise((resolve, reject) => {
        DB.query(`
            SELECT
                restocks.id,
                items.item_name,
                restocks.item,
                restocks.restock_qty,
                restocks.date,
                restocks.vendor_id,
                vendors.name AS vendor_name,
                items.isbn
            FROM
                restocks
                LEFT JOIN vendors ON restocks.vendor_id = vendors.id
                LEFT JOIN items on restocks.item = items.id
                WHERE restocks.vendor_id = ?
                ORDER BY restocks.date ASC
            `, [id], (err, restockForms) => {
            try {
                if (err) throw err;
                resolve(restockForms)
            } catch (error) {
                reject(error)
            }
        })
    })
}

exports.getAllRestockForms = () => {
    return new Promise((resolve, reject) => {
        DB.query(`
            SELECT
                restocks.id,
                items.item_name,
                restocks.item AS item_id,
                restocks.restock_qty,
                restocks.date,
                restocks.vendor_id,
                vendors.name AS vendor_name,
                items.isbn
            FROM
                restocks
                LEFT JOIN vendors ON restocks.vendor_id = vendors.id
                LEFT JOIN items on restocks.item = items.id
                ORDER BY restocks.date ASC
            `, [], (err, restockForms) => {
            try {
                if (err) throw err;
                resolve(restockForms)
            } catch (error) {
                reject(error)
            }
        })
    })
}

exports.deleteRestockOrder = (id) => {
    return new Promise((resolve, reject) => {
        DB.query("DELETE FROM restocks WHERE id = ?",[id], (err, res) => {
            try {
                if (err) throw err;
                resolve(res)
            } catch (error) {
                reject(error)
            }
        })

    })
}

exports.getRestocksByVendorAndCurrentDate = (vendor_id, currentMonth) => {
    return new Promise((resolve, reject) => {
        DB.query(`
            SELECT
                items.id AS item_id,
                items.item_name,
                items.price,
                items.qty,
                items.vendor AS item_vendor,
                vendors.name AS vendor_name,
                vendors.consignment,
                items.isbn,
                restocks.id AS restock_id,
                restocks.restock_qty,
                restocks.date AS restock_date
            FROM
                items
                LEFT JOIN restocks ON items.id = restocks.item
                LEFT JOIN vendors ON items.vendor = vendors.id
                WHERE items.vendor = ? 
                AND (restocks.date LIKE ? OR restocks.date IS NULL)
                
            `,[vendor_id, `%${currentMonth}%`], (err, data) => {
                try {
                    if (err) throw err;
                    resolve(data)
                } catch (error) {
                    reject(error)
                }
            })
    })
}

exports.getItemSalesByVendor = (vendor_id) => {
    return new Promise((resolve, reject) => {
        DB.query(`
            SELECT
                items.*,
                sales.id AS sales_id,
                sales.qty_sold,
                sales.start_date,
                sales.end_date
            FROM
                items
                LEFT JOIN sales ON items.id = sales.id
                WHERE vendor = ?
                
            `,[vendor_id], (err, sales) => {
                try {
                    if (err) throw err;
                    resolve(sales)
                } catch (error) {
                    reject(error)
                }
            })
    })
}

exports.saveSalesForVendor = (sale, dateRange, vendor_id) => {
    return new Promise((resolve, reject) => {
        DB.query("INSERT INTO sales SET ?", {
            id: uuidv4(),
            item_id: sale.id,
            qty_sold: sale.qty_sold,
            vendor_id: vendor_id,
            start_date: dateRange.firstDay,
            end_date: dateRange.lastDay
        }, (err, res) => {
            try {
                if (err) throw err;
                resolve(res)
            } catch (error) {
                reject(error)
            }
        })
    })
}