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

// UPDATE AUG 27 BELOW
function convertTo12Hour(time) {
  if (typeof time !== 'string') {
    return ''; // or some default value
  }

  let [hours, minutes] = time.split(':');
  let period = 'AM';
  hours = parseInt(hours);

  if (hours >= 12) {
    period = 'PM';
    if (hours > 12) {
      hours -= 12;
    }
  } else if (hours === 0) {
    hours = 12;
  }

  return `${hours}:${minutes} ${period}`;
}
// UPDATE AUG 27 ABOVE

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
// Serve static files such as HTML, CSS, and JavaScript
app.use(express.static(path.join(__dirname, 'System')));
app.use('/css', express.static(path.join(__dirname, 'views', 'css'), { 'extensions': ['css'] }));



app.get('/', (req, res) => {
  res.render("indexcustodianlogin", { message: '' });
});

app.get('/indexcustodianlogin.ejs', (req, res) => {
  res.render("indexcustodianlogin", { message: '' });
});

app.get('/indexcustodianhomepage.ejs', (req, res) => {
  res.render("indexcustodianhomepage", { message: '' });
});

app.get('/indexborrowerlogin.ejs', (req, res) => {
  res.render('indexborrowerlogin'); // Replace 'indexcustodianhomepage' with your actual template name
});

app.get('/borrowerinfo.ejs', (req, res) => {
  res.render('borrowerinfo'); // Replace 'indexcustodianhomepage' with your actual template name
});

app.get('/indexasset', (req, res) => {
  res.render('indexasset');
});

app.get('/indexwelcomepage.ejs', (req, res) => {
  res.render('indexwelcomepage'); // Replace 'indexwelcome' with your actual template name
});

app.get('/indexavailpage.ejs', (req, res) => {
  res.render('indexavailpage'); // Replace 'indexwelcome' with your actual template name
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

app.get('/indexarchivepage', (req, res) => {
  // Render the indexarchivepage.ejs file
  res.render('indexarchivepage');
});

// Define a route to render the indexavailpage.ejs file
app.get('/indexavailpage', (req, res) => {
  res.render('indexavailpage'); // Render indexavailpage.ejs
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
  try {
  const dBoard201DbCollection = dBoard201Db.collection(dBoard201DbCollectionName);
  const count201 = await dBoard201DbCollection.countDocuments({ isDeleted: { $ne: true } }); 
  res.status(200).json({ count201 }); // Changed from 201 to 200 as it's a success response
} catch (error) {
  res.status(500).json({ error: 'Internal server error' }); // Handle errors gracefully
  }
});

// Server-side route to get asset count for ROOM 202
app.get('/assetcount202', async (req, res) => { 
  try {
    const dBoard202DbCollection = dBoard202Db.collection(dBoard202DbCollectionName);
    const count202 = await dBoard202DbCollection.countDocuments({ isDeleted: { $ne: true } }); // Exclude documents with isDeleted: true
    res.status(200).json({ count202 }); // Changed from 201 to 200 as it's a success response
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' }); // Handle errors gracefully
  }
});

app.get('/totalassetscount', async(req, res) => { // TOTAL ASSETS ON DASHBOARD CONTENT
  const dBoard201DbCollection = dBoard201Db.collection(dBoard201DbCollectionName);
  const dBoard202DbCollection = dBoard202Db.collection(dBoard202DbCollectionName);

  // Count documents without isDeleted:true for both collections
  const count201 = await dBoard201DbCollection.countDocuments({ isDeleted: { $ne: true } });
  const count202 = await dBoard202DbCollection.countDocuments({ isDeleted: { $ne: true } });

  const totalCount = count201 + count202;

  res.status(201).send({ totalCount });
})


app.get('/indexreportcount', async (req, res) => { // REPORT COUNTER ON CUSTODIAN HOMEPAGE
  try {
    const reportCollection = reportDb.collection(reportCollectionName);
    const count = await reportCollection.countDocuments({
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
    });
    res.status(200).send({ count });
  } catch (error) {
    console.error('Error fetching report count:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/indexborroweditem', async (req, res) => {
  const lendingCollection = lendingDb.collection(lendingCollectionName);
  // Count documents where isDeleted is false or the field does not exist
  const count = await lendingCollection.countDocuments({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] });

  res.status(201).send({ count });
});

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

app.put('/assetsupdate/dBoard201', async (req, res) => {
  try {
    // Extract RDF and RTF values from the request body
    const { rdf, rtf, room, loc, cat, itemdesc, propnum, unitcost, account, bar } = req.body;

    // Update the status of Room 201 asset in the database
    await dBoard201Db.collection(dBoard201DbCollectionName).updateOne(
      { rdf_number: rdf, rtf_number: rtf, room: room, location: loc, category: cat, item_description: itemdesc,
      property_number: propnum, unit_cost: unitcost, barcode: bar, accountability: account,}, // Update based on RDF and RTF numbers
      { $set: { asset_status: req.body.asset_status } } // Update asset_status
    );

    // Send a success response
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

app.post('/indexborrowforms', async (req, res) => { 
  const {
    name,
    email,
    usernum,
    item_description,
    barcode,
    borrow_date,
    return_date,
    status,
  } = req.body;

  try {
    const client = new MongoClient(dbConfig.lending.url);

    await client.connect();
    const lendingDb = client.db(dbConfig.lending.dbName);
    const lendingCollection = lendingDb.collection(dbConfig.lending.collectionName);

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

    const result = await lendingCollection.insertOne(assetDocument);

    if (result.insertedId) {
      console.log(`Inserted a document with id: ${result.insertedId}`);

      const updateBorrowedStatus = async (dbUrl, dbName, collectionName, barcode) => {
        const client = new MongoClient(dbUrl);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.updateOne(
          { barcode },
          { $set: { isBorrowed: true } }
        );
        await client.close();
      };

      try {
        await Promise.all([
          updateBorrowedStatus(dbConfig.dBoard201.url, dbConfig.dBoard201.dbName, dbConfig.dBoard201.collectionName, barcode),
          updateBorrowedStatus(dbConfig.dBoard202.url, dbConfig.dBoard202.dbName, dbConfig.dBoard202.collectionName, barcode)
        ]);
        console.log("Updated isBorrowed status in dBoard201 and dBoard202 collections.");

        const mailOptions = {
          from: 'rpc.assetms@gmail.com',
          to: email,
          subject: 'Asset Borrowed',
          text: `
          Dear ${name},

Thank you for submitting your request to borrow ${item_description}. We have received your request and are currently processing it.

To proceed further, kindly go to ICT 209 / ITD Office and look for Mr. Homer Morallo. Present this email as proof of your request, and Mr. Morallo will assist you in finalizing the borrowing process.

The item is needed to be returned on ${return_date}.

For further questions or need for assistance, please don't hesitate to contact us at (046) 481 1900 local (3134).

Thank you for your cooperation.

Best Regards,

Homer Morallo
CSIT Laboratory Technician`
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
      } catch (updateError) {
        console.error("Error updating isBorrowed status:", updateError);
        res.status(500).json({ message: "Failed to update isBorrowed status." });
      }
    } else {
      console.log("Data is undefined.");
      res.status(500).json({ message: "Failed to submit asset." });
    }

    await client.close();
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

// Update asset in the Lending collection
app.put('/assetsupdate/:id', async (req, res) => {
  const { id } = req.params;
  const updatedAsset = req.body;

  console.log('Received Database ID:', id);
  console.log('Request Body:', updatedAsset);

  try {
    const client = new MongoClient(dbConfig.lending.url);
    await client.connect();
    const lendingDb = client.db(dbConfig.lending.dbName);
    const lendingCollection = lendingDb.collection(dbConfig.lending.collectionName);

    const result = await lendingCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedAsset }
    );

    console.log('Database Update Result:', result);

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Asset updated successfully' });
    } else {
      res.status(404).json({ message: 'Asset not found' });
    }

    await client.close();
  } catch (err) {
    console.error('Error updating asset:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update isBorrowed status in dBoard201 and dBoard202 collections
app.put('/updateBorrowStatus/:barcode', async (req, res) => {
  const { barcode } = req.params;

  const updateBorrowedStatus = async (dbUrl, dbName, collectionName, barcode) => {
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.updateOne(
      { barcode },
      { $unset: { isBorrowed: "" } }
    );
    await client.close();
    return result;
  };

  try {
    await Promise.all([
      updateBorrowedStatus(dbConfig.dBoard201.url, dbConfig.dBoard201.dbName, dbConfig.dBoard201.collectionName, barcode),
      updateBorrowedStatus(dbConfig.dBoard202.url, dbConfig.dBoard202.dbName, dbConfig.dBoard202.collectionName, barcode)
    ]);
    console.log("Updated isBorrowed status in dBoard201 and dBoard202 collections.");

    res.status(200).json({
      message: "Borrow status updated successfully."
    });
  } catch (error) {
    console.error("Error updating borrow status:", error);
    res.status(500).json({ message: "Failed to update borrow status." });
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

app.get('/report_item_description', async (req, res) => { // ASSET CONDITION FORM AFTER SCANNING ON PLACEHOLDER
  try {
    const { barcode } = req.query;
    console.log('Received barcode:', barcode); // Add this line to log the received barcode
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
    let description, location;
    if (item1) {
      description = item1.item_description;
      location = item1.location;
    } else {
      description = item2.item_description;
      location = item2.location;
    }

    console.log('Description:', description); // Add this line to log the description
    console.log('Location:', location); // Add this line to log the location

    // Concatenate description and location, separated by a comma or any other delimiter as needed
    const combinedDescription = `${description}, ${location}`;

    // Return a JSON response with the combined description
    res.status(200).json({ description: combinedDescription });
  } catch (error) {
    console.error('Error fetching item description for report:', error);
    res.status(500).send(`Error fetching item description for report: ${error.message}`);
  }
});

app.put('/assetsupdate/dBoard201/:serial_number', async (req, res) => {
  try {
    const serialNumber = req.params.serial_number;
    

    // Merge all fields into the update operation
    const updateFields = {
      ...(req.body.asset_status && { asset_status: req.body.asset_status }),
      ...(req.body.rdf_number && { rdf_number: req.body.rdf_number }),
      ...(req.body.rtf_number && { rtf_number: req.body.rtf_number }),
      ...(req.body.room && { room: req.body.room }),
      ...(req.body.location && { location: req.body.location }),
      ...(req.body.category && { category: req.body.category }),
      ...(req.body.item_description && { item_description: req.body.item_description }),
      ...(req.body.property_number && { property_number: req.body.property_number }),
      ...(req.body.unit_cost && { unit_cost: req.body.unit_cost }),
      ...(req.body.accountability && { accountability: req.body.accountability }),
      ...(req.body.barcode && { barcode: req.body.barcode })
    };

    // Update the item in the database using the serial number
    await dBoard201Db.collection(dBoard201DbCollectionName).updateOne(
      { serial_number: serialNumber }, // Update based on serial number
      { $set: updateFields }
    );

    // Send a success response
    return res.json({ message: 'Asset data updated successfully' });
  } catch (error) {
    console.error('Error updating:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/softdelete/dBoard201/:barcode', async (req, res) => {
  const { barcode } = req.params;
  const updatedAsset = req.body;

  console.log('Received barcode:', barcode);
  console.log('Request Body:', updatedAsset);

  try {
    // Find all documents in the database based on the barcode
    const assets = await dBoard201Db.collection(dBoard201DbCollectionName).find({ barcode: barcode }).toArray();

    if (assets.length === 0) {
      res.status(404).json({ message: 'No assets found with the given barcode' });
      return;
    }

    let successCount = 0;
    for (const asset of assets) {
      const result = await dBoard201Db.collection(dBoard201DbCollectionName).updateOne(
        { _id: asset._id }, // Use the found document's _id
        { $set: updatedAsset }
      );

      if (result.modifiedCount === 1) {
        successCount++;
      }
    }

    if (successCount > 0) {
      if (updatedAsset.isDeleted) {
        res.status(200).json({ message: `${successCount} assets soft deleted successfully` });
      } else {
        res.status(200).json({ message: `${successCount} assets updated successfully` });
      }
    } else {
      res.status(500).json({ message: 'Failed to update any assets' });
    }
  } catch (err) {
    console.error('Error updating assets:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/assetsupdate/dBoard202/:serial_number', async (req, res) => {
  try {
    const serialNumber = req.params.serial_number;
    

    // Merge all fields into the update operation
    const updateFields = {
      ...(req.body.asset_status && { asset_status: req.body.asset_status }),
      ...(req.body.rdf_number && { rdf_number: req.body.rdf_number }),
      ...(req.body.rtf_number && { rtf_number: req.body.rtf_number }),
      ...(req.body.room && { room: req.body.room }),
      ...(req.body.location && { location: req.body.location }),
      ...(req.body.category && { category: req.body.category }),
      ...(req.body.item_description && { item_description: req.body.item_description }),
      ...(req.body.property_number && { property_number: req.body.property_number }),
      ...(req.body.unit_cost && { unit_cost: req.body.unit_cost }),
      ...(req.body.accountability && { accountability: req.body.accountability }),
      ...(req.body.barcode && { barcode: req.body.barcode })
    };

    // Update the item in the database using the serial number
    await dBoard202Db.collection(dBoard202DbCollectionName).updateOne(
      { serial_number: serialNumber }, // Update based on serial number
      { $set: updateFields }
    );

    // Send a success response
    return res.json({ message: 'Asset data updated successfully' });
  } catch (error) {
    console.error('Error updating:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/softdelete/dBoard202/:barcode', async (req, res) => {
  const { barcode } = req.params;
  const updatedAsset = req.body;

  console.log('Received barcode:', barcode);
  console.log('Request Body:', updatedAsset);

  try {
    // Find all documents in the database based on the barcode
    const assets = await dBoard202Db.collection(dBoard202DbCollectionName).find({ barcode: barcode }).toArray();

    if (assets.length === 0) {
      res.status(404).json({ message: 'No assets found with the given barcode' });
      return;
    }

    let successCount = 0;
    for (const asset of assets) {
      const result = await dBoard202Db.collection(dBoard202DbCollectionName).updateOne(
        { _id: asset._id }, // Use the found document's _id
        { $set: updatedAsset }
      );

      if (result.modifiedCount === 1) {
        successCount++;
      }
    }

    if (successCount > 0) {
      if (updatedAsset.isDeleted) {
        res.status(200).json({ message: `${successCount} assets soft deleted successfully` });
      } else {
        res.status(200).json({ message: `${successCount} assets updated successfully` });
      }
    } else {
      res.status(500).json({ message: 'Failed to update any assets' });
    }
  } catch (err) {
    console.error('Error updating assets:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/alldata', async (req, res) => {
  try {
    // Fetch all data from the MongoDB collections for Borrower, Report, dBoard201, and dBoard202
    const allData = {
      borrower: await borrowerDb.collection(borrowerCollectionName).find({}).toArray(),
      lending: await lendingDb.collection(lendingCollectionName).find({}).toArray(),
      report: await reportDb.collection(reportCollectionName).find({}).toArray(),
      dBoard201: await dBoard201Db.collection(dBoard201DbCollectionName).find({}).toArray(),
      dBoard202: await dBoard202Db.collection(dBoard202DbCollectionName).find({}).toArray()
    };

    // Log the fetched data
    console.log('Fetched all data:', allData);

    // Send the fetched data as a JSON response
    res.json(allData);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error fetching all data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/availability/items', async (req, res) => {
  try {
      // Check if the database connections are established
      if (!dBoard201Db || !dBoard202Db) {
          console.log('Database connections are not established yet.');
          return res.status(500).json({ error: 'Database connections are not ready.' });
      }

      // Fetch data from the MongoDB collections for dBoard201Db and dBoard202Db
      const data201 = await dBoard201Db.collection(dBoard201DbCollectionName).find({
          $nor: [
            
              { isDeleted: true },
              { isBorrowed: true }
          ]
      }).toArray();
      const data202 = await dBoard202Db.collection(dBoard202DbCollectionName).find({
          $nor: [
              { isDeleted: true },
              { isBorrowed: true }
          ]
      }).toArray();

      // Count the number of items in each category for each collection
      const counts201 = {};
      const counts202 = {};

      // Count items for data201
      data201.forEach(item => {
          if (counts201[item.category]) {
              counts201[item.category]++;
          } else {
              counts201[item.category] = 1;
          }
      });

      // Count items for data202
      data202.forEach(item => {
          if (counts202[item.category]) {
              counts202[item.category]++;
          } else {
              counts202[item.category] = 1;
          }
      });

      // Send the counts as part of the response
      res.json({ counts201, counts202 });
  } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// UPDATE AUG 27 BELOW
// Route to handle form submission
app.post('/submitBorrowerInfo', async (req, res) => {
  try {
    const borrowerData = req.body;
    const collection = lendingDb.collection(lendingCollectionName);

    const assets = [];
    if (Array.isArray(borrowerData.asset)) {
      for (let i = 0; i < borrowerData.asset.length; i++) {
        if (borrowerData.asset[i] && typeof borrowerData.available[i] !== 'undefined') {
          assets.push({
            asset: borrowerData.asset[i],
            available: borrowerData.available[i],
          });
        }
      }
    } else if (borrowerData.asset) {
      assets.push({
        asset: borrowerData.asset,
        available: borrowerData.available || true,
      });
    }

    const dataToSave = {
      fullName: borrowerData.fullName || '',
      universityEmail: borrowerData.universityEmail || '',
      studentFaculty: borrowerData.studentFaculty || '',
      studentFacultyNumber: borrowerData.studentFacultyNumber || '',
      department: borrowerData.department || '',
      cys: borrowerData.cys || '',
      assets: assets,
      dateBorrowed: borrowerData.dateBorrowed || '',
      timeBorrowed: convertTo12Hour(borrowerData.timeBorrowed || ''),
      returnDate: borrowerData.returnDate || '',
      returnTime: convertTo12Hour(borrowerData.returnTime || ''),
      status: borrowerData.status || "Pending",
    };

    await collection.insertOne(dataToSave);

    // Send the email after successfully saving the data
    const mailOptions = {
      from: 'rpc.assetms@gmail.com',
      to: borrowerData.universityEmail,
      subject: 'Asset Borrowed',
      text: `
      Dear ${borrowerData.fullName},

      Thank you for submitting your request to borrow ${assets.length} asset/s. We have received your request and are currently processing it.

      To proceed further, kindly go to ICT 209 / ITD Office and look for Mr. Homer Morallo. Present this email as proof of your request, and Mr. Morallo will assist you in finalizing the borrowing process.

      The item is needed to be returned on ${borrowerData.returnDate} at ${borrowerData.returnTime}.

      For further questions or need for assistance, please don't hesitate to contact us at (046) 481 1900 local (3134).

      Thank you for your cooperation.

      Best Regards,

      Homer Morallo
      CSIT Laboratory Technician`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ success: false, message: 'Error sending email.' });
      } else {
        console.log("Email sent:", info.response);
        return res.json({ success: true, message: 'Form data received and saved.', notification: 'Data has been successfully submitted and saved. An email confirmation has been sent.' });
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while saving the data.' });
  }
});

// UPDATE AUG 28, 2024

app.get('/fetchBorrowerDetails', async (req, res) => {
  try {
      const barcode = req.query.barcode;
      console.log("Received barcode: " + barcode); // Log the received barcode
      const collection = lendingDb.collection(lendingCollectionName);

      const borrower = await collection.findOne({ studentFacultyNumber: barcode });
      console.log("Query result: ", borrower); // Log the query result

      if (borrower) {
          res.json({
              success: true,
              data: {
                  fullName: borrower.fullName,
                  universityEmail: borrower.universityEmail,
                  studentFaculty: borrower.studentFaculty,
                  department: borrower.department,
                  cys: borrower.cys
              }
          });
      } else {
          res.json({ success: false, message: 'No data found for the barcode.' });
      }
  } catch (error) {
      console.error('Error fetching borrower details:', error);
      res.status(500).json({ success: false, message: 'Server error.' });
  }
});

app.get('/fetchItemDetails', async (req, res) => {
  try {
      const barcode = req.query.barcode;
      console.log("Received barcode: " + barcode); // Log the received barcode

      // List of all collections to search
      const collections = [
          'dBoard201', 'dBoard202', 'dBoard203', 'dBoard204', 'dBoard205',
          'dBoard206', 'dBoard207', 'dBoard208', 'dBoard209', 'dBoard210',
          'dBoard211', 'dBoard212', 'dBoard213'
      ];

      let item = null;

      // Iterate over each collection to find the item
      for (let i = 0; i < collections.length; i++) {
          const collectionName = collections[i];
          const collection = dBoard201Db.collection(collectionName); // Replace `db` with your MongoDB database connection

          item = await collection.findOne({ barcode: barcode });

          if (item) {
              break; // Stop searching if the item is found
          }
      }

      console.log("Query result: ", item); // Log the query result

      if (item) {
          res.json({
              success: true,
              data: {
                  item_description: item.item_description
              }
          });
      } else {
          res.json({ success: false, message: 'No item found for this barcode.' });
      }
  } catch (error) {
      console.error('Error fetching item details:', error);
      res.status(500).json({ success: false, message: 'Server error.' });
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