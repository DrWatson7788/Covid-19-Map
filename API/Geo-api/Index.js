// const http = require("http")
// Using express
const express = require("express")
const pool = require("./db")
const pool2 = require("./db2")
const pool3 = require("./db3")
const pool4 = require("./db4")
const cors = require('cors');
const app = express()


app.use(cors());
app.use(express.json())

app.get("/",(req, res)=>{
    res.write("FIRST-API2"),
    res.end();
})
app.get("/api/PatientsTotal",(req, res)=>
{
    pool.query(
        "SELECT * FROM public.patientstotal",
        (error,results)=>
        {
            if(error)
            {
                throw error
            }
            else{
                res.status(200).json(results.rows)
            }
        }
    )
})

app.get("/api/PatientsTotal/:name",(req, res)=>
{

    const {name} = req.params

    pool.query(
        "SELECT * FROM public.patientstotal where district =$1 ",[name],
        (error,results)=>
        {
            if(error)
            {
                throw error
            }
            else{
                res.status(200).json(results.rows)
            }
        }
    )
})

app.get("/api/PatientsMonth",(req, res)=>
{
    pool2.query(
        "SELECT * FROM public.patientsmonth",
        (error,results)=>
        {
            if(error)
            {
                throw error
            }
            else{
                res.status(200).json(results.rows)
            }
        }
    )
})

app.get("/api/PatientsMonth/:name",(req, res)=>
{

    const {name} = req.params

    pool2.query(
        "SELECT * FROM public.patientsmonth where district =$1 ",[name],
        (error,results)=>
        {
            if(error)
            {
                throw error
            }
            else{
                res.status(200).json(results.rows)
            }
        }
    )
})

app.get("/api/vaccine/",(req, res)=>
{
    pool3.query(
        "SELECT * FROM public.vaccinedatasl",
        (error,results)=>
        {
            if(error)
            {
                throw error
            }
            else{
                res.status(200).json(results.rows)
            }
        }
    )
})
app.get("/api/CovidDeaths/",(req, res)=>
{
    pool4.query(
        "SELECT * FROM public.coviddeaths",
        (error,results)=>
        {
            if(error)
            {
                throw error
            }
            else{
                res.status(200).json(results.rows)
            }
        }
    )
})


app.listen(5000, ()=>{
    console.log("listening to port 5000")
})




