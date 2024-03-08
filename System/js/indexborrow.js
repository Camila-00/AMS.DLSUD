const express = require("express"); // BORROW.HTML
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require("nodemailer"); // Import the nodemailer library
const app = express();
const port = 3000;

const mongoUri = "mongodb+srv://dlsud-ramirez:ramirez_dlsud@cluster0.omal3j2.mongodb.net/"; // Update with your MongoDB connection URI
// const mongoUri = "mongodb://localhost:27017/"; // Update with your MongoDB connection URI
const dbName = "Backend";
const collectionName = "Lending"; // Use an appropriate collection name

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail' for Gmail, or specify your SMTP settings
  auth: {
    user: 'school.angeloramirez@gmail.com', // Your email address
    pass: 'yrnd exxs lflw lokv', // Your email password
  },
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'System', "borrow.html"));
});

app.get("/borrow.html", (req, res) => {
  res.sendFile(path.join(__dirname, 'System', "borrow.html"));
});

app.post("/indexborrow", async (req, res) => {
    const {
      name,
      email,
      dept,
      student_office_id,
      asset_type,
      barcode,
      borrow_date,
      return_date,
      status
    } = req.body;
  
    // Set a default value for status if it's not provided in the request
    const defaultStatus = "Pending";
    const finalStatus = status || defaultStatus;
  
    try {
      const client = new MongoClient(mongoUri, { useNewUrlParser: true });
  
      try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
  
        const assetDocument = {
          name,
          email,
          dept,
          student_office_id,
          asset_type,
          barcode,
          borrow_date,
          return_date,
          status: finalStatus, // Assign the final status
        };
  
        const result = await collection.insertOne(assetDocument);
  
        console.log(`Inserted a document with id: ${result.insertedId}`);
        client.close();
  
        if (result.insertedId) {
          console.log("Data is registered:");
          console.log(assetDocument); // Log all items received in the request

        // Send an email to the user
        const mailOptions = {
            from: 'school.angeloramirez@gmail.com', // Sender's email address
            to: email, // User's email address
            subject: 'Asset Borrowed', // Email subject
            text: `Dear ${name}
            Your request has been approved for borrowing ${asset_type} from our School's inventory. 
            
            We would like to remind you of our School's policy regarding the responsible use and return of borrowed items. 
            We place great importance on the timely return of assets to ensure they are readily available for other students/faculty who may require them.
            
            The item is needed to be returned at ${return_date} 
            
            Please arrange for the return of the ${asset_type} to its designated location as soon as it is no longer required for your specific project or task.
            
            Your cooperation in this matter is vital to maintaining our operational efficiency and resource management.`, // Email body
            
          };
          

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });

        res.status(201).send("Asset stored successfully.");
      } else {
        console.log("Data is undefined.");
        res.status(500).send("Failed to submit asset.");
      }
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
