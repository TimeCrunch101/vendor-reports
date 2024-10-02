if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const opts = require("../config/options.json")

/**
 * @param {String} password 
 * @returns The password hash or and Error
 */

exports.hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            try {
                if (err) throw err;
                resolve(hash)
            } catch (error) {
                reject(error)
            }
        });
    })
}

/**
 * @param {String} receivedPassword 
 * @param {String} passwordFromDB 
 * @returns True if the password matches the hash, False if they don't, or an Error message.
 */

exports.checkPassword = (receivedPassword, passwordFromDB) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(receivedPassword, passwordFromDB, (err, result) => {
            try {
                if (err) throw err;
                if (!result) resolve(false)
                resolve(true)
            } catch (error) {
                reject(error)
            }
        });
    })
    
}

/**
 * @param {Object} user The User Object
 * @param {String} user.user_id
 * @param {String} user.first_name
 * @param {String} user.last_name
 * @param {String} user.full_name
 * @param {String} user.email
 * @returns The Signed Json Web Token
 */

exports.createJWT = (user) => {
    return new Promise((resolve, reject) => {
        try {
            const token = jwt.sign({
                id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                full_name: user.full_name,
                email: user.email
                },
                process.env.JWT_SKEY,
                { expiresIn: opts.jwt_expire_time.value });
            resolve(token)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * @param {Object} req The HTTP request Object
 * @param {Object} res The HTTP response Object
 * @param {*} next Move onto the next function
 */

exports.isAuthenticated = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ", 2)
        const user = jwt.verify(token[1], process.env.JWT_SKEY)
        res.user = user;
        next()
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized"
        })
    }
}

/**
 * @param {Object} req The HTTP request Object
 * @param {Object} res The HTTP response Object
 * @param {*} next Move onto the next function
 */

exports.isNotAuthenticated = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ", 2);
      jwt.verify(token[1], process.env.JWT_SKEY);
      res.sendStatus(401);
    } catch (error) {
      next();
    }
  };