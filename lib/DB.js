const mySQL = require('mysql2')
const {Info} = require('./secreat.js')

const pool = mySQL.createPool(Info)
const promisePool = pool.promise()

module.exports = {
    Pool: promisePool
}