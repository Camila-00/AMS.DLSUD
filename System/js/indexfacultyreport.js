const express = require('express'); // INDEX FACULTY REPORT.HTML
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000; // Replace with your desired port number

const mongoUri = 'mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/'; // Update with your MongoDB URI
const dbName = 'Backend'; // Update with your database name
const collectionName = 'Report'; // Update with your collection name

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve the index.html and your JavaScript file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'System', 'indexfacultyreport.html'));
});
app.get('/indexfacultyreport.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'indexfacultyreport.js'));
});

// MongoDB connection setup
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
    .then(() => {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Define an API route to fetch reports
        app.get('/reports', async (req, res) => {
            const reports = await collection.find({}).toArray();
            res.json(reports);
        });
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
