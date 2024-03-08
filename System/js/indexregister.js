const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const port = 3000; // Replace with your desired port number

const mongoUri = 'mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/'; // Include the database name after the slash
const dbName = "Backend";
const collectionName = "LendingRegis"; // Use the correct collection name

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "System", "indexregister.html"));
});

app.post('/indexregister', async (req, res) => {
  const { name, email, userid, password } = req.body;

  try {
    const client = new MongoClient(lendingregisUrl, { useNewUrlParser: true });

    try {
      await client.connect();
      const db = client.db(lendingregisDbName);
      const collection = db.collection(lendingregisCollectionName);

      const newUser = {
        name,
        email,
        userid,
        password
      };

      console.log("New User Data:", newUser); // Log the newUser object

      const result = await collection.insertOne(newUser);

      console.log(`Inserted a document with id: ${result.insertedId}`);
      client.close();

      res.status(201).send("Registration successful. You can now log in.");
    } catch (error) {
      console.error("Error during MongoDB operations:", error);
      res.status(500).send("Failed to submit user.");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).send("Failed to connect to the database.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
