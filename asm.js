const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require("ejs");
const app = express();
const session = require('express-session');  // Add this line
const port = 3000;
// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'rpc.assetms@gmail.com',
    pass: 'qodv mbpq swoc zxvc',
  },
});
// Connection URLs and Database Names
const dbConfig = {
  login: {
    url: 'mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/',
    dbName: 'Backend',
    collectionName: 'Details',
  },
  status: {
    url: 'mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/',
    dbName: 'Backend',
    collectionName: 'Status',
  },
  report: {
    url: 'mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/',
    dbName: 'Backend',
    collectionName: 'Report',
  },
  lending: {
    url: 'mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/',
    dbName: 'Backend',
    collectionName: 'Lending',
  },
  dBoard201: {
    url: 'mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/',
    dbName: 'Backend',
    collectionName: 'dBoard201',
  },
  dBoard202: {
    url: 'mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/',
    dbName: 'Backend',
    collectionName: 'dBoard202',
  },

  borrower: {
    url: 'mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/',
    dbName: 'Backend',
    collectionName: 'Borrower',
  },
};
let client;
let loginDb;
let statusDb;
let reportDb;
let lendingDb;
let dBoard201Db;
let dBoard202Db;
let borrowerDb;

let loginCollectionName;
let statusCollectionName;
let reportCollectionName;
let lendingCollectionName;
let dBoard201DbCollectionName;
let dBoard202DbCollectionName;
let borrowerCollectionName;

async function connectToDatabases() {
  try {
    const loginClient = await MongoClient.connect(dbConfig.login.url);
    loginDb = loginClient.db(dbConfig.login.dbName);
    loginCollectionName = dbConfig.login.collectionName;

    const statusClient = await MongoClient.connect(dbConfig.status.url);
    statusDb = statusClient.db(dbConfig.status.dbName);
    statusCollectionName = dbConfig.status.collectionName;

    const reportClient = await MongoClient?.connect(dbConfig.report.url);
    reportDb = reportClient.db(dbConfig.report.dbName);
    reportCollectionName = dbConfig.report.collectionName;

    const lendingClient = await MongoClient.connect(dbConfig.lending.url);
    lendingDb = lendingClient.db(dbConfig.lending.dbName);
    lendingCollectionName = dbConfig.lending.collectionName;

    const dBoard201Client = await MongoClient.connect(dbConfig.dBoard201.url);
    dBoard201Db = dBoard201Client.db(dbConfig.dBoard201.dbName);
    dBoard201DbCollectionName = dbConfig.dBoard201.collectionName;

    const dBoard202Client = await MongoClient.connect(dbConfig.dBoard202.url);
    dBoard202Db = dBoard202Client.db(dbConfig.dBoard202.dbName);
    dBoard202DbCollectionName = dbConfig.dBoard202.collectionName;

    const borrowerClient = await MongoClient.connect(dbConfig.borrower.url);
    borrowerDb = borrowerClient.db(dbConfig.borrower.dbName);
    borrowerCollectionName = dbConfig.borrower.collectionName; 

    console.log('Connected to MongoDB!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

app.use(express.json());
app.use(cors());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));


// Serve the HTML files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'System')));



app.get('/', (req, res) => {
  res.render("indexwelcomepage");
});
app.get('/indexcustodianlogin', (req, res) => {
  res.render("indexcustodianlogin", { message: '' });
});

app.get('/indexcustodianhomepage.ejs', (req, res) => {
  res.render("indexcustodianhomepage", { message: '' });
});

app.get('/indexborrowerlogin.ejs', (req, res) => {
  res.render('indexborrowerlogin'); // Replace 'indexcustodianhomepage' with your actual template name
});

app.get('/indexwelcomepage.ejs', (req, res) => {
  res.render('indexwelcomepage'); // Replace 'indexwelcome' with your actual template name
});

app.get('/indexborrowforms', (req, res) => {
  const user = req.session.user || {};  // default to an empty object if user is undefined
  res.render('indexborrowforms', { user });
});

app.get('/indexrooms201.ejs', (req, res) => {
  const user = req.session.user || {};  // default to an empty object if user is undefined
  res.render('indexrooms201.ejs', { user });
});

app.get('/indexrooms202.ejs', (req, res) => {
  const user = req.session.user || {};  // default to an empty object if user is undefined
  res.render('indexrooms202.ejs', { user });
});

app.get('/indexregisterborrowerpage.ejs', (req, res) => {
  res.render('indexregisterborrowerpage');
});

app.get('/indexfacultyreportinput', (req, res) => {
  // Logic to render or send the indexfacultyreportinput.ejs file
  res.render('indexfacultyreportinput');
});


// SERVER SIDE STARTS UNDER
app.get('/indexcustodianhomepage', async (req, res) => { // CUSTODIAN HOMEPAGE COMPLETE
  try {
    // Check if the user is logged in and if there is a user in the session
    const user = req.session.user;

    if (!user || !user.adminum) {
      // Redirect to the login page if the user is not logged in
      return res.redirect('/indexcustodianlogin');
    }

    const userAdminum = user.adminum;

    // Retrieve the user details including email from the database
    const custodianUser = await loginDb.collection(loginCollectionName).findOne({ adminum: userAdminum });

    if (!custodianUser || !custodianUser.adminum) {
      // Redirect to the login page if user details are not found or email is not defined
      return res.redirect('/indexcustodianlogin');
    }

    // Log the value of email
    console.log('User ID:', userAdminum);

    // Render the view with the retrieved data
    res.render('indexcustodianhomepage', { user: user });
  } catch (error) {
    // Handle errors, e.g., redirect to an error page
    console.error('Error in /indexcustodianhomepage:', error);
    res.redirect('/error');
  }
});

//different room counter - ROOM 201
app.get('/assetcount201', async (req, res) => { 
  const dBoard201DbCollection = dBoard201Db.collection(dBoard201DbCollectionName);
  const count201 = await dBoard201DbCollection.count();
  res.status(201).send({ count201 });
});

// Server-side route to get asset count for ROOM 202
app.get('/assetcount202', async (req, res) => { 
  try {
    const dBoard202DbCollection = dBoard202Db.collection(dBoard202DbCollectionName);
    const count202 = await dBoard202DbCollection.countDocuments(); // Changed from count() to countDocuments() as count() is deprecated
    res.status(200).json({ count202 }); // Changed from 201 to 200 as it's a success response
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' }); // Handle errors gracefully
  }
});


app.get('/totalassetscount', async(req, res) => { // TOTAL ASSETS ON DASHBOARD CONTENT
  const dBoard201DbCollection = dBoard201Db.collection(dBoard201DbCollectionName);
  const dBoard202DbCollection = dBoard202Db.collection(dBoard202DbCollectionName);

  const count201 = await dBoard201DbCollection.count();
  const count202 = await dBoard202DbCollection.count();

  const totalCount = count201 + count202;

  res.status(201).send({totalCount});
})

app.get('/indexreportcount', async(req, res) => { // REPORT COUNTER ON CUSTODIAN HOMEPAGE
  const reportCollection = reportDb.collection(reportCollectionName);
  const count = await reportCollection.count()
  res.status(201).send({count});
})

app.get('/indexborroweditem', async(req, res) => { // BORROWER COUNTER ON CUSTODIAN HOMEPAGE
  const ledingCollection = lendingDb.collection(lendingCollectionName);
  const count = await ledingCollection.count()
  res.status(201).send({count});
})




app.post('/indexregisterborrowerpage', async (req, res) => { // BORROWER REGISTER
  // Handle registration logic here
  const { name, email, usernum, password } = req.body;

  console.log('User Input:', { name, email, usernum, password });

  // Assuming you have a MongoDB collection named 'borrower'
  const borrowerCollection = borrowerDb.collection(borrowerCollectionName);

  console.log('Checking if user already exists...');
  // Check if the user already exists
  const existingUser = await borrowerCollection.findOne({ email });

  if (existingUser) {
    console.log('User already exists. Sending 400 response...');
    res.status(400).send('Email already registered');
  } else {
    console.log('User does not exist. Registering user...');
    // If the user doesn't exist, save the registration data to the database
    await borrowerCollection.insertOne({ name, email, usernum, password });

    console.log('User registered successfully. Sending 201 response...');
    // Send a success response
    res.status(201).send('Registration successful');
  }
});

app.post('/indexcustodianlogin', async (req, res) => { // CUSTODIAN LOGIN 
  const { adminum, password } = req.body;

  try {
    if (!loginDb) {
      console.log('Login database connection is not established yet.');
      return res.status(500).json({ error: 'Login database connection is not ready.' });
    }

    const user = await loginDb.collection(loginCollectionName).findOne({ adminum, password });

    if (user) {
      req.session.user = {
        email: user.adminum,
        first_name: user.first_name, // Make sure this property is available
        last_name: user.last_name
      };
      console.log('Login successful for user:', user);
      // res.status(200).render('indexcustodianlogin.ejs', { message: 'Login successful!', auth: req.session.user });
      res.status(200).json({ message: 'Login successful!', auth: req.session.user });
    } else {
      console.log('Invalid username or password.');
      res.status(401).render('indexcustodianlogin.ejs', { message: 'Invalid username or password.' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).render('indexcustodianlogin.ejs', { message: 'An error occurred during login.' });
  }
});

app.post('/indexborrowerlogin', async (req, res) => { // BORROWER LOGIN
  const { email, password } = req.body;

  try {
    if (!borrowerDb) {
      console.log('Login database connection is not established yet.');
      return res.status(500).json({ error: 'Login database connection is not ready.' });
    }

    const user = await borrowerDb.collection(borrowerCollectionName).findOne({ email, password });

    if (user) {
      req.session.user = user;  // Set the user in the session
      console.log('Login successful for user:', user);
      res.status(200).render('indexborrowerlogin.ejs', { user });
    } else {
      console.log('Invalid username or password.');
      res.status(401).render('indexborrowerlogin.ejs', { message: 'Invalid username or password.' });
    }
  } // Closing bracket for try block
  catch (error) {
    console.error('Error during login:', error);
    res.status(500).render('indexborrowerlogin.ejs', { message: 'An error occurred during login.' });
  }
});


app.post('/indexassettable', async (req, res) => { // ADD ASSET FORM FOR ASSET TABLE
  const {
    room,
    location,
    category,
    item_description,
    property_number,
    serial_number,
    unit_cost,
    rdf_number,
    rtf_number,
    asset_status,
  } = req.body;

  try {
    console.log({
      room,
      location,
      category,
      item_description,
      property_number,
      serial_number,
      unit_cost,
      rdf_number,
      rtf_number,
      asset_status,
    });

    const client = new MongoClient(dbConfig.status.url);

    try {
      // Change: Dynamic collection name based on room
      const collectionName = `dBoard${room}`;

      // Generate barcode based on property number
      const barcode = property_number;

      const assetDocument = {
        room,
        location,
        category,
        item_description,
        property_number,
        serial_number,
        unit_cost,
        rdf_number,
        rtf_number,
        asset_status,
        barcode, // Save barcode along with other asset details
      };

      const result = await statusDb.collection(collectionName).insertOne(assetDocument);

      console.log(`Inserted a document with id: ${result.insertedId}`);
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

app.post('/indexfacultyreportinput', async (req, res) => { // BROKEN ITEMS FORM

  const { report_location, report_barcode, report_item_description, report_issue } = req.body;

  console.log({ report_location, report_barcode, report_item_description, report_issue })

  try {

    try {
      const assetDocument = { report_location, report_barcode, report_item_description, report_issue }

      const result = await reportDb.collection(reportCollectionName).insertOne(assetDocument)

      console.log(`Inserted a document with id: ${result.insertedId}`);
      console.log('Inserted Document:', assetDocument); // Add this line

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


app.put('/data/dBoard201/:id', async (req, res) => { // WHAT THE HELL IS THIS // Route for fetching data from dBoard201Db
  try {
    // Check if the database connection is established
    if (!dBoard201Db) {
      console.log('Database connection for dBoard201Db is not established yet.');
      return res.status(500).json({ error: 'Database connection for dBoard201Db is not ready.' });
    }

    const { id } = req.params;
    const { asset_status } = req.body;

    // Update the asset status in the MongoDB collection for dBoard201Db
    const result = await dBoard201Db.collection(dBoard201DbCollectionName).updateOne(
      { _id: ObjectId(id) },
      { $set: { asset_status } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Send success response
    res.json({ message: 'Asset status updated successfully' });
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  // Render your main index.ejs file
  res.render('index');
});

app.get('/indexarchivepage', (req, res) => {
  // Render the indexarchivepage.ejs file
  res.render('indexarchivepage');
});

app.get('/data/dBoard201', async (req, res) => { // Route for fetching data from dBoard201Db
  try {
    // Check if the database connection is established
    if (!dBoard201Db) {
      console.log('Database connection for dBoard201Db is not established yet.');
      return res.status(500).json({ error: 'Database connection for dBoard201Db is not ready.' });
    }

    // Fetch data from the MongoDB collection for dBoard201Db
    const data201 = await dBoard201Db.collection(dBoard201DbCollectionName).find({}).toArray();
    console.log('Fetched data from dBoard201Db:', data201);

    // Send the fetched data as a JSON response
    res.json(data201);
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/data/dBoard202', async (req, res) => { // Route for fetching data from dBoard202Db
  try {
    // Check if the database connection is established
    if (!dBoard202Db) {
      console.log('Database connection for dBoard202Db is not established yet.');
      return res.status(500).json({ error: 'Database connection for dBoard202Db is not ready.' });
    }

    // Fetch data from the MongoDB collection for dBoard202Db
    const data202 = await dBoard202Db.collection(dBoard202DbCollectionName).find({}).toArray();
    console.log('Fetched data from dBoard202Db:', data202);

    // Send the fetched data as a JSON response
    res.json(data202);
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/indexreports/:id', async (req, res) => { // ARCHIVE + DELETE BUTTON REPORT FORMS
  const { id } = req.params; // Ensure that this is the correct variable name
  const updatedAsset = req.body;

  console.log('Received Database ID:', id);
  console.log('Request Body:', updatedAsset);

  try {
    const result = await reportDb.collection(reportCollectionName).updateOne(
      { _id: new ObjectId(id) }, // Use ObjectId directly for the _id
      { $set: updatedAsset } // Update all fields in the document
    );

    console.log('Database Update Result:', result);

    if (result.modifiedCount === 1) {
      if (updatedAsset.isDeleted) {
        res.status(200).json({ message: 'Asset soft deleted successfully' });
      } else {
        res.status(200).json({ message: 'Asset updated successfully' });
      }
    } else {
      res.status(404).json({ message: 'Asset not found' });
    }
  } catch (err) {
    console.error('Error updating asset:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/indexfacultyreportinputdata', async (req, res) => { // BROKEN ITEM REPORT DATABASE
  try {
    if (!reportDb) {
      console.log('Report database connection is not established yet.');
      return res.status(500).json({ error: 'Report database connection is not ready.' });
    }

    const reports = await reportDb.collection(reportCollectionName).find({}).toArray();
    console.log('Fetched data:', reports);
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/indexborrowforms', async (req, res) => { //BORROWER FORMS
  const {
    name,
    email,
    usernum,
    item_description,
    barcode,
    borrow_date,
    return_date,
    status,
  } = req.body; // Use req.body instead of req.query

  try {
    const client = new MongoClient(dbConfig.lending.url); // Use dbConfig.lending.url

    try {
      await client.connect();
      const db = client.db(dbConfig.lending.dbName); // Use dbConfig.lending.dbName
      const collection = db.collection(dbConfig.lending.collectionName); // Use dbConfig.lending.collectionName

      const assetDocument = {
        name,
        email,
        usernum,
        item_description,
        barcode,
        borrow_date,
        return_date,
        status: status || "Pending",
      };

      const serializedAssetDocument = JSON.stringify(assetDocument);
      const result = await collection.insertOne(JSON.parse(serializedAssetDocument));


      console.log(`Inserted a document with id: ${result.insertedId}`);
      client.close();

      if (result.insertedId) {
        console.log("Data is registered:");
        console.log(assetDocument);

        const mailOptions = {
          from: 'rpc.assetms@gmail.com',
          to: email,
          subject: 'Asset Borrowed',
          text: `Dear ${name},
          
          Your request has been approved for borrowing ${item_description} from our school's inventory. 
          
          We would like to remind you of our school's policy regarding the responsible use and return of borrowed items. 
          We place great importance on the timely return of assets to ensure they are readily available for other students/faculty who may require them.
          The item is needed to be returned on ${return_date} 
          Please arrange for the return of the ${item_description} to its designated location as soon as it is no longer required for your specific project or task.
          Your cooperation in this matter is vital to maintaining our operational efficiency and resource management.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });

        res.status(201).json({
          message: "Asset stored successfully.",
          user: { name, email, usernum }
        });
      } else {
        console.log("Data is undefined.");
        res.status(500).json({ message: "Failed to submit asset." });
      }
    } catch (error) {
      console.error("Error during MongoDB operations:", error);
      res.status(500).json({ message: "Failed to submit asset." });
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ message: "Failed to connect to the database." });
  }
});

app.get('/assets', async (req, res) => { // BORROWER DATA
  try {
    // Assuming you don't have a user authentication mechanism,
    // and you want to fetch all assets without filtering by user
    if (!lendingDb) {
      console.log('Lending database connection is not established yet.');
      return res.status(500).json({ error: 'Lending database connection is not ready.' });
    }

    const assets = await lendingDb.collection(lendingCollectionName)
      .find({ _id: { $exists: true, $ne: null } })
      .toArray();

    res.json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Assume you already have the MongoDB client and database connection set up

app.put('/assetsupdate/:id', async (req, res) => { // BORROWER DATA UPDATE AND ARCHIVE BUTTON
  const { id } = req.params; // Ensure that this is the correct variable name
  const updatedAsset = req.body;

  console.log('Received Database ID:', id);
  console.log('Request Body:', updatedAsset);

  try {
    const result = await lendingDb.collection(lendingCollectionName).updateOne(
      { _id: new ObjectId(id) }, // Use ObjectId directly for the _id
      { $set: updatedAsset } // Update all fields in the document
    );

    console.log('Database Update Result:', result);

    if (result.modifiedCount === 1) {
      if (updatedAsset.isDeleted) {
        res.status(200).json({ message: 'Asset soft deleted successfully' });
      } else {
        res.status(200).json({ message: 'Asset updated successfully' });
      }
    } else {
      res.status(404).json({ message: 'Asset not found' });
    }
  } catch (err) {
    console.error('Error updating asset:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/item_description', async (req, res) => { // BORROWER FORM AFTER SCANNING ON PLACEHOLDER
  try {
      // Check if the barcode parameter is present
      const { barcode } = req.query;
      if (!barcode) {
          return res.status(400).send('Barcode parameter is missing');
      }

      // Ensure case-insensitive matching for barcode
      const item1 = await dBoard201Db.collection(dBoard201DbCollectionName).findOne({ barcode: { $regex: new RegExp(`^${barcode}$`, 'i') } });
      const item2 = await dBoard202Db.collection(dBoard202DbCollectionName).findOne({ barcode: { $regex: new RegExp(`^${barcode}$`, 'i') } });

      // Check if item is not found in both databases
      if (!item1 && !item2) {
          return res.status(404).send('Item not found');
      }

      // Determine the item description based on the database where the item was found
      let description;
      if (item1) {
          description = item1.item_description;
      } else {
          description = item2.item_description;
      }

      // Return a JSON response with the item description
      res.status(200).json({ description });
  } catch (error) {
      console.error('Error fetching item description:', error);
      res.status(500).send(`Error fetching item description: ${error.message}`);
  }
});


app.put('/assetsupdate/dBoard201/:serial_number', async (req, res) => { // for UPDATES DBOARD201
  try {
    const serialNumber = req.params.serial_number;
    const updatedStatus = req.body.asset_status; // Change key to asset_status

    // Update the status of the item in the database using the serial number
    await dBoard201Db.collection(dBoard201DbCollectionName).updateOne(
      { serial_number: serialNumber }, // Update based on serial number
      { $set: { asset_status: updatedStatus } }
    );

    // Send a success response
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/assetsupdate/dBoard202/:serial_number', async (req, res) => {  // for UPDATES DBOARD202
  try {
    const serialNumber = req.params.serial_number;
    const updatedStatus = req.body.asset_status; // Change key to asset_status

    // Update the status of the item in the database using the serial number
    await dBoard202Db.collection(dBoard202DbCollectionName).updateOne(
      { serial_number: serialNumber }, // Update based on serial number
      { $set: { asset_status: updatedStatus } }
    );

    // Send a success response
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

connectToDatabases()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
