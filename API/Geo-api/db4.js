const Pool = require("pg").Pool
const pool = new Pool({
    user: "postgres",
    password: "omnibus",
    host: "localhost",
    database: "CovidDeaths",
    port: 5432
})


module.exports = pool