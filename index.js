
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000 ;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


// midleware 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('User info server running ')
})

const slot = require ('./slot.json');
const { application } = require('express');

// MongoDB part 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rhjlmgh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try{
    const allSectors = client.db('jobtask_saveData').collection('sectors');
    const userdata = client.db('jobtask_saveData').collection('userData');
    
      app.get('/slots', async(req, res)=> {
      const data = req.body ;
      res.send(slot)
    })


    // save user data in database 
    app.post('/userdata', async(req, res) => {
      const data = req.body ;
      console.log(data)
      const saveData = await userdata.insertOne(data);
      res.send(saveData)
      console.log(saveData)
    })

    // get save data from database 
    app.get('/userinfo/:email', async(req, res) =>  {
      const email = req.params.email ;
      const query = {email}
      const data = await userdata.findOne(query)
      res.send(data)  

    })

    // update user info 
    app.put('/userinfo/updateinfo/:email', async(req, res) => {
      const UserEmail = req.params.email ;
      const data = req.body ;
      const name = data.name ;
      const sectors = data.sectors ;
      const email = data.email ;
      const agree = data.agree ;
      const filter = {email:UserEmail} ;
      console.log(data,filter)
      const options = {upsert:true };
      const updateDoc = {
        $set: {
          name:name,
          slot: sectors,
          email:email,
          agree:agree 
        }
      }
      const result = await userdata.updateMany(filter,updateDoc,options)
      res.send(result)
    })
  }

  finally{

  }
}
run().catch(console.dir)


app.listen(port, () => {
  console.log(`User info server running on  ${port}`)
})