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
        DB.query("SELECT email FROM users WHERE email = ?",[email], (err, email) => {
            try {
                if (err) throw new Error("Could not fetch Email.", {cause: err.message})
                if (email.length > 0) throw new Error("That email is already registered")
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