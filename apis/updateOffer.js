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

//UPDATE LIMIT OFFER STATUS-------------TASK3
/*Allows to update status of an active and pending offer to accepted and rejected. Once an offer is accepted, 
we need to update limit values (current and last), as well as limit update date in the account object.*/

const updateOffer= async (req, res) => {
    try {
      const {offerId} = req.params ;
      const { status } = req.body;
  
      const updateOfferQuery = 'UPDATE limitOffer SET status = $1 WHERE limitOfferId = $2';
      await pool.query(updateOfferQuery, [status, offerId]);
      if (status == " ACCEPTED") {
        const offerQuery = 'SELECT account_id, newLimit,limitType FROM limitOffer WHERE limitOfferId = $1';
        const offerResult = await pool.query(offerQuery, [offerId]);
        if (offerResult.rowCount === 0) {
          return res.status(404).json({ error: 'count 0 Offer not found' });
        }
  
        const { account_id, newlimit, limittype } = offerResult.rows[0];
        if(limittype== "ACCOUNT_LIMIT")
        {
            const accountQuery='SELECT  account_limit FROM accounts WHERE account_id = $1';
            const accountResult=await pool.query(accountQuery,[ account_id  ]);
            const llimit=accountResult.rows[0].account_limit;
            const updateAccountQuery = `
            UPDATE accounts
            SET last_account_limit = $1,
                account_limit = $2,
                account_limit_update_time = NOW()
            WHERE account_id = $3`;
            
          await pool.query(updateAccountQuery, [llimit, newlimit, account_id]);
        }
        else{

          const accountQuery='SELECT per_transaction_limit FROM accounts WHERE account_id = $1';
          const accounttransactionResult=await pool.query(accountQuery,[ account_id  ]);
          const llimit=accounttransactionResult.rows[0].per_transaction_limit;
          const updateAccountQuery = `
          UPDATE accounts
          SET last_per_transaction_limit = $1,
              per_transaction_limit = $2,
             per_transaction_limit_update_time = NOW()
          WHERE account_id = $3`;
        await pool.query(updateAccountQuery, [llimit, newlimit, account_id]);
        }
      }
      res.json({ message: 'Offer status updated successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };


  module.exports={
    updateOffer
}




