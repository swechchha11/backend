require('dotenv').config();
const Pool=require('pg').Pool

const pool=new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT
})

//table limitoffer which will contain all the details of limit offer
const CreateLimitOffer = async () => {
    try {
  
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS limitOffer (
        limitOfferId INT PRIMARY KEY,
        account_id INT  not null,

        limitType VARCHAR(60) CHECK (limitType IN ('ACCOUNT_LIMIT', 'PER_TRANSACTION_LIMIT')),
        newLimit INT,
        status VARCHAR(20) DEFAULT 'PENDING',
        offerActivationTime TIMESTAMPTZ DEFAULT NOW(),
        offerExpiryTime TIMESTAMPTZ,
        FOREIGN KEY (account_id) REFERENCES accounts(account_id)

        )
      `);
  

      console.log('Schema and table for limitOffer created successfully.');
    } catch (error) {
      console.error('Error creating schema and table:', error);
    }
  };
  


  module.exports={
    CreateLimitOffer
  }