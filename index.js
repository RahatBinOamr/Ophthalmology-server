const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
/* middle ware */
app.use(cors());
app.use(express.json())




const uri = process.env.DB_URL;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




app.get('/',(req,res)=>{
    res.send( `server ${port}`)
})
app.listen(port,()=>console.log('server is running'))