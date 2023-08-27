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

//CREATE OFFER LIMIT---------------------------TASK 1
/*Allows to create a limit offer for an account. Offer should only be created for a greater limit than the current limit.
 Initially when an offer is created, status of the offer will be PENDING.*/

const addOffer=async(req,res)=>{


  console.log(req.body);
  const limitofferid=req.body.limitOfferId;
  const account_id=req.body.account_id;
  const limittype=req.body.limitType;
  const newlimit=req.body.newLimit;
  if(limittype=="ACCOUNT_LIMIT")
  {
    try {
      const accountQuery = await pool.query('SELECT account_limit FROM accounts WHERE account_id = $1', [account_id]);
      const currentLimit = accountQuery.rows[0].account_limit;
      if (newlimit > currentLimit) {
        const insertQuery = 'INSERT INTO limitOffer (limitOfferId,account_id, limitType, newLimit, offerExpiryTime) VALUES ($1, $2, $3,$4, NOW() + INTERVAL \'60 days\') RETURNING *';
        const values = [limitofferid,account_id, limittype, newlimit];
  
        const result = await pool.query(insertQuery, values);
        res.json({ success: true, offer: result.rows[0] });
      } else {
        res.status(400).json({ success: false, message: 'New limit must be greater than the current limit.' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'An error occurred.' });
    }
  }
  else
  { try {
    const accountQuery = await pool.query('SELECT per_transaction_limit FROM accounts WHERE account_id = $1', [account_id]);
    const currentLimit = accountQuery.rows[0].per_transaction_limit;
    if (newlimit > currentLimit) {
      const insertQuery = 'INSERT INTO limitOffer (limitOfferId,account_id, limitType, newLimit, offerExpiryTime) VALUES ($1, $2, $3,$4, NOW() + INTERVAL \'60 days\') RETURNING *';
      const values = [limitofferid,account_id, limittype, newlimit];

      const result = await pool.query(insertQuery, values);
      res.json({ success: true, offer: result.rows[0] });
    } else {
      res.status(400).json({ success: false, message: 'New limit must be greater than the current limit.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'An error occurred.' });
  }

  }
   
   
    
}




module.exports={
    addOffer
}



