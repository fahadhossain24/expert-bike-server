// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const app = express();
// const port = process.env.PORT || 5000;

// // middleware.....
// app.use(cors());
// app.use(express.json());

// // api............
// app.get('/', (req, res)=>{
//     res.send('server perfectly opened!!!');
// })

// //mongodb connection string..........
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3b7z5dk.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// // mongodb connection function....
// const run = async () => {
//     try{
//         await client.connect();
//         const serviceCollection = client.db('bikeServiceExpress').collection('services');

//         // load all service data from database and respons to client....
//         app.get('/service', async(req, res) => {
//             const query = {};
//             const cursor = serviceCollection.find(query);
//             const allService = await cursor.toArray();
//             res.send(allService);
//         })

//         // load single service data from database and responst to client....
//         app.get('/service/:id', async(req, res) => {
//             const id = req.params.id;
//             const query = {_id : new ObjectId(id)}
//             const singleServiceById = await serviceCollection.findOne(query);
//             res.send(singleServiceById);
//         })

//     }finally{
//         // client.close();
//     }
// }
// run().catch(console.dir)

// app.listen(port, () => {
//     console.log('server running on port', port);
// })