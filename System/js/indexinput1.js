const express = require("express"); // UNDER INDEXFACULTYREPORTINPUT.HTML
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;

const mongoUri = "mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/"; // Update with your MongoDB connection URI
const dbName = "Backend";
const collectionName = "Report";

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'System', "indexfacultyreportinput.html"));
});

app.get("/indexfacultyreportinput.html", (req, res) => {
  res.sendFile(path.join(__dirname, 'System', "indexfacultyreportinput.html"));
});

app.post("/indexfacultyreportinput", async (req, res) => {
  const {
    room,
    computer,
    cpu,
    monitor,
    keyboard,
    mouse,
    server,
    status
  } = req.body;

  try {
    const client = new MongoClient(mongoUri, { useNewUrlParser: true });
    
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
    
      const assetDocument = {
        room,
        computer,
        cpu,
        monitor,
        keyboard,
        mouse,
        server,
        status
      };
    
      const result = await collection.insertOne(assetDocument);
    
      console.log(`Inserted a document with id: ${result.insertedId}`);
      client.close();
    
      res.status(201).send("Asset stored successfully.");
    } catch (error) {
      console.error("Error during MongoDB operations:", error);
      res.status(500).send("Failed to submit asset.");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).send("Failed to connect to the database.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
