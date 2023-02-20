const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware.....
app.use(cors());
app.use(express.json());

// api............
app.get('/', (req, res) => {
    res.send('server perfectly opened!!!');
})

const verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorize access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JOT_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    })
    
    
}

//mongodb connection string..........
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3b7z5dk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//................Auth with jot Token
// create token, who hit this api? he will get a token as respons. but when request for this token he must be sended data for creating token.
app.post('/login', async (req, res) => {
    const user = req.body;
    const accessToken = jwt.sign(user, process.env.JOT_TOKEN_SECRET, {
        expiresIn: '1d'
    });
    res.send({ accessToken });
})

// mongodb connection function....
const run = async () => {
    try {
        await client.connect();
        const serviceCollection = client.db('bikeServiceExpress').collection('services');
        const orderCollection = client.db('bikeServiceExpress').collection('orders')

        // load all service data from database and respons to client....
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const allService = await cursor.toArray();
            res.send(allService);
        })

        // load single service data from database and responst to client....
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const singleServiceById = await serviceCollection.findOne(query);
            res.send(singleServiceById);
        })
        // add new service from client to database...
        app.post('/service', async (req, res) => {
            const serviceData = req.body;
            const insertResult = await serviceCollection.insertOne(serviceData);
            res.send(insertResult);
        })
        // delete specific service with id.....
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const deleteResult = await serviceCollection.deleteOne(query);
            res.send(deleteResult);
        })

        // add order to database from client side user.....
        app.post('/order', async (req, res) => {
            const order = req.body;
            const insertOrderResult = await orderCollection.insertOne(order);
            res.send(insertOrderResult);
        })
        // load order information from database to server and respons to client side
        app.get('/order', verifyJwt, async (req, res) => {
            const decodedEmail = req.decoded?.email;
            const email = req.query.email;
            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = orderCollection.find(query);
                const reslut = await cursor.toArray();
                res.send(reslut);
            }else{
                res.status(403).send({message: 'Forbidden access'})
            }
        })



    } finally {
        // client.close();
    }
}
run().catch(console.dir)

app.listen(port, () => {
    console.log('server running on port', port);
})