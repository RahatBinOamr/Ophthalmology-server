const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

async function run (){
    try{
        const servicesCollection = client.db('dentist').collection('service')
        app.get('/services',async(req,res)=>{
            const query = {};
            const cursor = servicesCollection.find(query)
            const services = await cursor.toArray()
            // console.log(services)
            // const count = await servicesCollection.estimatedDocumentCount();
            // res.send({count,services})
            res.send(services)
        })
        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id) };
            const cursor = servicesCollection.findOne(query);
            const service = await cursor.toArray();
            console.log(service);
            res.send(service)
        })
    }
    finally{

    }
}
run().catch(err=>console.error(err))


app.get('/',(req,res)=>{
    res.send( `server ${port}`)
})
app.listen(port,()=>console.log('server is running'))