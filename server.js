var express = require("express")
const { MongoClient, ServerApiVersion } = require('mongodb');
var app = express()
const uri = "mongodb+srv://s223765611:d6J1r5lR7i9tvF3w@sit725-2023-t1-prac4.epyv66e.mongodb.net/?retryWrites=true&w=majority&appName=sit725-2023-t1-prac4";
var port = process.env.port || 3000;
let collection;

app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function runDBConnection() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        collection = client.db().collection('cat');
        console.log(collection);
    } catch (ex) {
        console.error(ex);
    }
}

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/api/cats', (req, res) => {
    getAllCats((err, result) => {
        if (!err) {
            res.json({ statusCode: 200, data: result, message: 'get all cats success' });
        }
    });
});

app.post('/api/cat', (req, res) => {
    let cat = req.body;
    postCat(cat, (err, result) => {
        if (!err) {
            res.json({ statusCode: 201, data: result, message: 'success' });
        }
    });
});

function postCat(cat, callback) {
    collection.insertOne(cat, callback);
}

function getAllCats(callback) {
    collection.find({}).toArray(callback);
}
app.get('/css/styles.css', (req, res) => {
    res.type('text/css');
    res.sendFile(__dirname + '/public/css/styles.css');
});

app.listen(3000, () => {
    console.log('express server started');
    runDBConnection();
}); 