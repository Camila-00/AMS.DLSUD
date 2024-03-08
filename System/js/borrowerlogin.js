const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

const mongoURI = 'your-mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/-uri'; // Replace with your MongoDB connection URI
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/borrowerlogin', async (req, res) => {
  const { usernum, password } = req.body;

  try {
    await client.connect();
    const db = client.db('Backend'); // Replace with your MongoDB database name
    const collection = db.collection('LendingRegis'); // Replace with your MongoDB collection name

    const user = await collection.findOne({ usernum, password });

    if (user) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
