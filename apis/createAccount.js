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


//creates a account and add it details in table account
const addAccount=(req,res)=>{
    const {account_id,customer_id, account_limit, per_transaction_limit, last_account_limit, last_per_transaction_limit}=req.body;
    pool.query("INSERT INTO accounts (account_id,customer_id, account_limit, per_transaction_limit, last_account_limit, last_per_transaction_limit) VALUES ($1, $2,$3,$4,$5,$6) RETURNING *", 
    [account_id,customer_id, account_limit, per_transaction_limit, last_account_limit, last_per_transaction_limit], 
    (err, results) => {
        if(err)
        {
            throw err;
        }
        console.log(req.body);
        res.status(201).send(`user added with ID: ${results.rows[0].account_id}`);

    } )
}

//get all the account info
const getAccount=(req,res)=>{

    pool.query("SELECT * FROM accounts ORDER BY account_id", (err, results)=>{
        if(err)
        {
            throw err;
        }
        res.status(200).json(results.rows)

    })
}

module.exports={

    addAccount,
    getAccount
}
