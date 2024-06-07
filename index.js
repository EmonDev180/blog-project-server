const express = require('express');
const app = express()
require('dotenv').config()
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 4000;





app.use(cors())
app.use(express.json());



//BlogDB
//S2Nuh0gwfcZ8ahjU
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.stvj7tw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const uri = "mongodb+srv://BlogDB:S2Nuh0gwfcZ8ahjU@cluster0.stvj7tw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const postCollection = client.db('BlogDB').collection('posts');
    const blogCollection = client.db("BlogDB").collection('blogs');
    const wishlistCollection = client.db('BlogDB').collection('whishlists')
    const userCollection = client.db('BlogDB').collection('user');


    // user collection 

    app.post('/users',async(req,res) => {
      const user = req.body;
      const query = {email:user.email}
      const existingUser = await userCollection.findOne(query);
      if(existingUser){
        return res.send({message: 'user already exists'})
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    })




    //Post Blog

    app.get('/posts', async (req, res) => {



      const cursor = postCollection.find()

      const result = await cursor.toArray()

      res.send(result);




    })

    // blogs 

    app.get('/blogs', async (req, res) => {

      const result = await blogCollection.find().toArray()

      res.send(result);
    })


    app.post('/blogs', async (req, res) => {

      const blog = req.body;
      
      console.log(blog)

      console.log(blog)

      const result = await blogCollection.insertOne(blog)

      res.send(result)

    })

    // wishlist section

    app.get('/wishlists',async(req,res) => {

      const email = req.query.email;
      console.log(email);

      const query = {email:email};









      
      const result = await wishlistCollection.find(query).toArray()
      res.send(result);
    })

    app.post('/wishlists',async(req,res) => {

      const wishlist = req.body;

      console.log(wishlist)

      const result = await wishlistCollection.insertOne(wishlist);

      res.send(result);
    })

    app.delete('/wishlists/:id',async(req,res) => {
      
      const id = req.params.id;

      const query = {_id : new ObjectId(id)}

      const result = await wishlistCollection.deleteOne(query)

      res.send(result)
    })

 







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {

  res.send("server is runing ");

})


app.listen(port, (req, res) => {

  console.log(`blog website is runing,${port}`)
})