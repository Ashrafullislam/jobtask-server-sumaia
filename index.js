
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

const slot = require ('./slot.json')

// MongoDB part 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rhjlmgh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)

async function run() {
  try{
    const allSectors = client.db('jobtask_saveData').collection('sectors');
    const userdata = client.db('jobtask_saveData').collection('userData');
    
    // find all sectors option from database 
    // app.get('/slots', async(req, res)=> {
    //   const  query = {} ;
    //   const sector = await allSectors.find(query).toArray();
    //   res.send(sector)
    // })

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

    // gate save data from database 
    app.get('/userinfo/:email', async(req, res) =>  {
      const email = req.params.email ;
      const query = {email}
      const data = await userdata.findOne(query)
      res.send(data)  

    })
  }

  finally{

  }
}
run().catch(console.dir)


app.listen(port, () => {
  console.log(`User info server running on  ${port}`)
})