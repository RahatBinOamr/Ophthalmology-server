const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
var jwt = require('jsonwebtoken');

/* middle ware */
app.use(cors());
app.use(express.json())


function verifyJWT(req,res,next){
console.log(req.headers.authorization)
const authHeader = req.headers.authorization;
if(!authHeader){
  return res.status(401).send({message:'unauthorize access'})
}
const token = authHeader.split(' ')[1];
jwt.verify(token,process.env.SEC_USER,function(err,decoded){
  if(err){
    return res.status(403).send({message:'Forbidden access'})
  }
  req.decoded=decoded;
  next()
})
}

const uri = process.env.DB_URL;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        const servicesCollection = client.db('dentist').collection('service')
        const visitCollection = client.db('dentist').collection('visitor')
        app.post('/jwt',async(req,res)=>{
            const visitor = req.body;
            const token = jwt.sign(visitor,process.env.SEC_USER,{expiresIn:'2d'})
            res.send({token})
        })

        app.get('/services',async(req,res)=>{
            const query = {};
            const cursor = servicesCollection.find(query)
            const services = await cursor.toArray()
            // console.log(services)
          
            res.send(services)
        })
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
        
            res.send(service);
          });

/* visitor */
          app.get('/visitors',verifyJWT,async(req,res)=>{
            const decoded = req.decoded
            console.log('inside visitor api',decoded);
            if(decoded.email!==req.query.email){
              res.status(403).send({message:'unauthorize access'})
            }
            let query ={};
            if(req.query.email){
                query={
                    email:req.query.email
                }
            }
            const cursor = visitCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
          })
          app.post('/visitors',async(req,res)=>{
            const visitor = req.body;
            const result = await visitCollection.insertOne(visitor)
            res.send(result)
          })
         app.get('/visitors/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const patient = await visitCollection.findOne(query)
            res.send(patient)
         }) 
        app.patch('/visitors/:id', async (req, res) => {
          const { id } = req.params;
          const result = await visitCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body });
          if (result.matchedCount) {
            res.send({
              success: true,
              message: `successfully updated ${req.body.name}`,
            });
          }
        })
          app.delete('/visitors/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await visitCollection.deleteOne(query);
            res.send(result);
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