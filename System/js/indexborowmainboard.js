const express = require('express'); // MAINBOARD.HTML
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const path = require('path');
const app = express();
const port = 3000;

const mongoUri = 'mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/';
const dbName = 'Backend';
const collectionName = 'Lending';

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'System', 'mainboard.html'));
});

const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
    .then(() => {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        app.get('/assets', async (req, res) => {
            const assets = await collection.find({}).toArray();
            res.json(assets);
        });

        // Update an asset by ID
        app.put('/assetsupdate/:id', async (req, res) => {
            const { id } = req.params;
            const updatedAsset = req.body;

            try {
                const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedAsset });
                if (result.modifiedCount === 1) {
                    res.status(200).json({ message: 'Asset updated successfully' });
                } else {
                    res.status(404).json({ message: 'Asset not found' });
                }
            } catch (err) {
                console.error('Error updating asset:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Delete an asset by ID
        app.delete('/assetdelete/:id', async (req, res) => {
            const { id } = req.params;

            try {
                const result = await collection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount === 1) {
                    res.status(200).json({ message: 'Asset deleted successfully' });
                } else {
                    res.status(404).json({ message: 'Asset not found' });
                }
            } catch (err) {
                console.error('Error deleting asset:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
