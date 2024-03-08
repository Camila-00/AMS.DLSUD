const express = require('express'); // SEE COMMENTS ON INDEXLOGIN HTML
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path'); // Add the path module
const app = express();
const port = 3000;

app.use(cors());

// MongoDB Connection URL
const mongoURL = 'mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/';
const dbName = 'Backend';
const collectionName = 'Status';

// Serve the HTML file from the correct directory
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'System', 'indexdata.html'); // Construct the file path
  res.sendFile(indexPath);
});

// Connect to MongoDB and retrieve data
app.get('/data', async (req, res) => {
  try {
    const client = new MongoClient(mongoURL, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const data = await collection.find({}).toArray();
    client.close();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
