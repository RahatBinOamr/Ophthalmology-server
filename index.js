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
        const visitCollection = client.db('dentist').collection('visitor')
        app.get('/services',async(req,res)=>{
            const query = {};
            const cursor = servicesCollection.find(query)
            const services = await cursor.toArray()
            // console.log(services)
            // const count = await servicesCollection.estimatedDocumentCount();
            // res.send({count,services})
            res.send(services)
        })
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            console.log('vist')
            res.send(service);
          });


          app.post('/visitors',async(req,res)=>{
            const visitor = req.body;
            const result = await visitCollection.insertOne(visitor)
            res.send(result)
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