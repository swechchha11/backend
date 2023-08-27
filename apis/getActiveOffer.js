require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();


app.use(bodyParser.json());
app.use(express.json());

const pool=new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT
})


//this function is used to get the all the limitoffers.
const getOffer=(req,res)=>{
    pool.query("SELECT * FROM limitOffer ", (err, results)=>{
        if(err)
        {
            throw err;
        }
        res.status(200).json(results.rows)

    })
}

// LIST ACTIVE LIMITOFFERS ----------------TASK2
/*Allows to fetch active offers for a given account id and active date. 
An active offer, is the one which is PENDING, and offerActivationTime is before activeDate and offerExpiryTime is after activeDate.*/
const getActiveOffer=async(req, res)=>{
    try {
        const { account_id, active_date } = req.params;
        const result = await pool.query(
            'SELECT * FROM limitOffer WHERE account_id = $1 AND status = \'PENDING\' AND offerActivationTime < $2 AND offerExpiryTime > $2',
            [account_id, active_date]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching active offers.');
    }

}

module.exports={
    getOffer,
    getActiveOffer
}