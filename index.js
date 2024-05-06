const nodemailer = require("nodemailer");
const express = require("express");
const dotenv = require("dotenv");

const mongoose = require("mongoose");

dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "olaniyanp11@gmail.com",
    pass: "your_gmail_password",
  },
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
console.log(process.env.MONGODB_URI);
mongoose
  .connect(
    "mongodb+srv://olaniyanp11:mt3V-9kVrAPSZ.7@cluster0.vgpzmvs.mongodb.net/Ounce",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define MongoDB schema and model
const OunceSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
});

const Ounce = mongoose.model("Ounce", OunceSchema);

// Define routes
app.get("/getall33456", async (req, res) => {
  try {
    const emails = await Ounce.find({}, { _id: 0, email: 1 });

    if (emails && emails.length > 0) {
      const emailList = emails.map((item) => item.email);
      return res.status(200).json(emailList);
    } else {
      return res.status(404).json({ error: "No email found" });
    }
  } catch (error) {
    console.error("Error in route handler:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addemail", async (req, res) => {
  const { email } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const existingEmail = await Ounce.findOne({ email });

    if (existingEmail) {
      return res
        .status(409)
        .json({ error: "Email already exists in the waiting list" });
    }

    const newEntry = new Ounce({ email });
    await newEntry.save();

    const mailOptions = {
      from: "olaniyanp11@gmail.com",
      to: email,
      subject: "Nodemailer Email Example",
      text: "This is the plain text content of the email.",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Ounce Waiting List</title>
        <style>
          /* Your CSS styles */
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Ounce!</h1>
          <p>Thank you for joining our waiting list.</p>
          <a href="https://www.ounce.com" class="button">Visit Website</a>
        </div>
      </body>
      </html>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error.message);
        return res.status(500).json({ error: "Failed to send email" });
      } else {
        console.log("Email sent successfully:", info.response);
        return res
          .status(201)
          .json({ message: "Email added and sent successfully" });
      }
    });
  } catch (error) {
    console.error("Error inserting email:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Start the Express server
app.listen(port, () => {
  console.log(`Server started @ port ${port}`);
});
