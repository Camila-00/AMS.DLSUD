const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Assuming your HTML files are in the "public" directory

const mongoUri = "mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/";
const dbName = "Backend";
const collectionName = "trial";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "System", "form1.html"));
});

// ...

app.post("/form1", async (req, res) => {
    const { name, email } = req.body;
  
    try {
      const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
  
      const database = client.db(dbName);
      const collection = database.collection(collectionName);
  
      const user = { name, email };
      const result = await collection.insertOne(user);
  
      console.log(`User inserted with _id: ${result.insertedId}`);
      
      client.close();
  
      // Log the user data before sending the response
      console.log("User Data Sent:", { name, email });
  
      // Send a JSON response with the user data
      res.json({ name, email });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // ...
  

app.get("/form2", (req, res) => {
  // Get user data from the URL
  const { name, email } = req.query;

  res.sendFile(path.join(__dirname, "System", "form2.html"));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
