const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;

const reportUrl = "mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/"; // Change variable name to reportUrl
const statusDbName = "Backend"; // Change variable name to statusDbName
const statusCollectionName = "Status"; // Change variable name to statusCollectionName

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'System', "indexinput1.html"));
});

app.get("/indexinput1.html", (req, res) => {
  res.sendFile(path.join(__dirname, 'System', "indexinput1.html"));
});

app.post('/indexinput1', async (req, res) => { // CUSTODIAN INPUT
  const { room, location, category, item_description, bundle, property_number, serial_number, unit_cost, rdf_number, rtf_number, unit_status, accountability } = req.body;

  try {
    const client = new MongoClient(reportUrl, { useNewUrlParser: true, useUnifiedTopology: true }); // Add useUnifiedTopology

    try {
      await client.connect();
      const db = client.db(statusDbName);
      const collection = db.collection(statusCollectionName);

      const assetDocument = {
        room,
        location,
        category,
        item_description,
        bundle,
        property_number,
        serial_number,
        unit_cost,
        rdf_number,
        rtf_number,
        unit_status,
        accountability,
      };

      const result = await collection.insertOne(assetDocument);

      console.log(`Inserted a document with id: ${result.insertedId}`);
      client.close();

      res.status(201).send('Asset stored successfully.');
    } catch (error) {
      console.error('Error during MongoDB operations:', error);
      res.status(500).send('Failed to submit asset.');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    res.status(500).send('Failed to connect to the database.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
