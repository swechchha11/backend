require('dotenv').config();
const Pool=require('pg').Pool

const pool=new Pool({
  user:process.env.DB_USER,
  host:process.env.DB_HOST,
  database:process.env.DB_DATABASE,
  password:process.env.DB_PASSWORD,
  port:process.env.DB_PORT
})

//table account which will store all the details associated with account
const createAccounts = async () => {
    try {
  
      await pool.query(`
        CREATE TABLE IF NOT EXISTS accounts (
        account_id INT PRIMARY KEY not null,
        customer_id INT,
        account_limit INT,
        per_transaction_limit INT,
        last_account_limit INT,
        last_per_transaction_limit INT,
        account_limit_update_time TIMESTAMPTZ DEFAULT NOW(),
        per_transaction_limit_update_time TIMESTAMPTZ DEFAULT NOW()
          
        )
      `);
  

      console.log('Schema and accounts table created successfully.');
    } catch (error) {
      console.error('Error creating schema and table:', error);
    }
  };
  


  module.exports={
    createAccounts,
  }
  