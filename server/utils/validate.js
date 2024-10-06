const { Resolver } = require("node:dns");
const resolver = new Resolver()
resolver.setServers(["1.1.1.1"])

/**
 * @param {String} domain The domain name to search
 * @returns True if the MX record was found. Returns an error is nothing was found.
 */

const checkEmail = (domain) => {
    return new Promise((resolve, reject) => {
        resolver.resolveMx(domain, (err, addr) => {
            try {
                if (err?.code === "ENODATA") throw new Error("No MX Record found for that Domain", {
                    cause: `NSLOOKUP Failed finding an MX record for ${domain}, DNS Server used: 1.1.1.1`
                });
                if (err) throw new Error("And error occurred while preforming a NSLOOKUP", {cause: err.message});
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    })
}

/**
 * @param {Object} user 
 * @param {String} user.first_name
 * @param {String} user.last_name
 * @param {String} user.email
 * @param {String} user.password
 * @returns True if all checks pass.
 */

exports.checkUserFields = (user) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (user.first_name === null || user.first_name === undefined || user.first_name.length < 2) {
                throw new Error("First name can't be blank", {cause: "first_name field was blank or too short"})
            }
            else if (user.last_name === null || user.last_name === undefined || user.last_name.length < 2) {
                throw new Error("Last name can't be blank", {cause: "last_name field was blank or too short"})
            }
            else if (user.email === null || user.email === undefined || user.email.length === 0) { 
                throw new Error("Email can't be blank", {cause: "email field was blank"})
            }
            else if (!user.email.includes("@")) {
                throw new Error("Did not receive a properly formatted email", {cause: "Email must include @"})
            }
            else if (user.email.split("@")[1].length === 0) {
                throw new Error("Did not receive a properly formatted email", {cause: "No domain following the @"})
            }
            else if (user.password === null || user.password === undefined || user.password.length < 8) {
                throw new Error("Password is too short", {cause: "password was too short. It must be longer than 8 characters"})
            } else {
                await checkEmail(user.email.split("@")[1])
                resolve(true)
            }
        } catch (error) {
            reject(error)
        }
    })
}

exports.prepareReport = (report) => {
    return new Promise((resolve, reject) => {
        const itemMap = new Map();
        report.forEach(item => {
          const existingItem = itemMap.get(item.item_id);
          if (existingItem) {
            existingItem.restock_qty += item.restock_qty ?? 0;
          } else {
            itemMap.set(item.item_id, { ...item });
          }
        });
        resolve(Array.from(itemMap.values()))
    })
}