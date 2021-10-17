const Pool = require("pg").Pool
const pool = new Pool({
    user: "postgres",
    password: "omnibus",
    host: "localhost",
    database: "CovidVaccine",
    port: 5432
})


module.exports = pool