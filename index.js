const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 6000;

//use middleware//
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.emj3m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





async function run() {

    try {
        await client.connect();
        const inventoryCollection = client.db('tech_inventory_solution').collection('inventory');
        console.log('connected to db successfully');

        //get api to read all notes
        // http://localhost:5000/inventories

        app.get("/inventories", async (req, res) => {
            const q = req.query;
            const cursor = inventoryCollection.find(q);
            const result = await cursor.toArray();
            console.log(q);
            res.send(result);
        })

        //get api for a user's added items

        app.get("/inventories", async (req, res) => {
            const email=req.query.email;
            const query = {email};
            const cursor = inventoryCollection.find(query);
            const result = await cursor.toArray();
            console.log(query);
            res.send(result);
        })

        //get api for a perticular item
        app.get("/inventories/:id",async(req,res)=>{
            const id = req.params.id;
            const query ={_id:ObjectId(id)};
            const result =await inventoryCollection.findOne(query);
            res.send(result);
        })

        


        //create/POST notes api
        // http://localhost:5000/product
        
        

        app.post("/inventory", async (req, res) => {
            const data = req.body;
            console.log('getting data', data);
            const result = await inventoryCollection.insertOne(data);
            res.send(result);

        })



        // update notes api
        // http://localhost:5000/product/62754395b1c6026d9cb9ce66
        app.put('/inventory/:id',async(req,res)=>{
            const id = req.params.id;
            const data = req.body;
            console.log('from update api',data);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    // userName: data.userName,
                    // textData: data.textData,
                    ...data
                },
              };
              const result = await inventoryCollection.updateOne(filter, updateDoc, options);

            console.log('from put method', id);
            res.send(result);
        })


        //delete notes api
        // http://localhost:5000/inventory/62754395b1c6026d9cb9ce66
        app.delete('/inventory/:id',async(req,res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const result = await inventoryCollection.deleteOne(filter)
            res.send(result);
        })

    }

    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my node CRUD server')
});

app.listen(port, () => {
    console.log('CRUD server is running at', port);
})