require('dotenv').config();
const express=require("express");


const bodyParser=require("body-parser");
const createAccountTable=require('./models/account');
const limitOfferTable=require('./models/limitOffer');
const createaccount=require('./apis/createAccount');
const createlimitoffer=require('./apis/createLimitOffer');
const getactiveoffer=require('./apis/getActiveOffer');
const updateoffer=require('./apis/updateOffer');

const db=require('./apis/createLimitOffer');

const app=express();

const PORT=process.env.PORT || 5000;

createAccountTable.createAccounts();
limitOfferTable.CreateLimitOffer();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.post('/createaccount',createaccount.addAccount );
app.post('/createoffer',createlimitoffer.addOffer);
app.get('/createaccount', createaccount.getAccount);
app.get('/createoffer',getactiveoffer.getOffer);
app.get('/activeoffer/:account_id/:active_date', getactiveoffer.getActiveOffer);
app.put('/createoffer/:offerId',updateoffer.updateOffer);

app.listen(PORT, ()=>{

    console.log("app is listening at port no 5000");
})