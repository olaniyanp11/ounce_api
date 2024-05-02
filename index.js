// app.js
const nodemailer = require("nodemailer");
const express = require("express");
const dotenv = require("dotenv");
const { connection, connectToDatabase } = require("./connection/connect.js");

dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "olaniyanp11@gmail.com",
    pass: "ptnm crxk nxpg rkjq",
  },
});
const app = express();
const port = process.env.PORT || 3000; // Default port 3000 if PORT is not specified

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database when the server starts
connectToDatabase();

// Define your routes here
app.get("/", async (req, res) => {
  try {
    const sql = `SELECT email FROM waiting_list`;

    // Execute the SQL query
    connection.query(sql, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Check if there are any results returned
      if (results && results.length > 0) {
        // Extract email from the results
        const email = results.map((result) => result.email);

        // Send extracted email as JSON response
        return res.status(200).json(email);
      } else {
        return res.status(404).json({ error: "No email found" });
      }
    });
  } catch (error) {
    console.error("Error in route handler:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/addemail", async (req, res) => {
  const { email } = req.body;

  // Validate email format
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Insert email into waiting_list table
    connection.query(
      "SELECT * FROM waiting_list WHERE email = ?",
      [email],
      (error, results) => {
        if (results.length > 0) {
          return res
            .status(409)
            .json({ error: "Email already exists in the waiting list" });
        }
        else {
              const sql = `INSERT INTO waiting_list(email) VALUES(?)`;
              // Configure email options
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
            body {
              font-family: Arial, sans-serif;
              background-color: #f8f8f8;
              color: #333;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #007bff;
              text-align: center;
            }
            p {
              font-size: 16px;
              line-height: 1.6;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to Ounce!</h1>
            <p>Thank you for joining our waiting list. We will keep you updated with the latest news and announcements.</p>
            <p>In the meantime, feel free to explore our <a href="https://www.ounce.com">website</a>.</p>
            <a href="https://www.ounce.com" class="button">Visit Website</a>
          </div>
        </body>
        </html>`, // Optional HTML content
              };

              // Send email notification
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error("Error sending email:", error.message);
                  return res
                    .status(500)
                    .json({ error: "Failed to send email" });
                } else {
                  console.log("Email sent successfully:", info.response);
                  const results = connection.query(sql, [email]);
                  return res.status(201).json({
                    message:
                      "Email added to waiting list and sent successfully",
                  });
                }
              });
        }
      }
    );


  } catch (error) {
    console.error("Error inserting email:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Function to validate email format (basic validation)
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Start the Express server
app.listen(port, () => {
  console.log(`Server started @ port ${port}`);
});
