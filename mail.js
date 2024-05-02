
// Configuration for an SMTP server (replace with your credentials)
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure:true,
  auth: {
    user: "letitia.luettgen64@ethereal.email",
    pass: "yjDm7nSMbAzBftfTjG",
  },
});

// Email content
const mailOptions = {
  from: "olaniyanp11@gmail.com",
  to: "recipient@example.com",
  subject: "Nodemailer Email Example",
  text: "This is the plain text content of the email.",
  html: "<b>This is the HTML content of the email.</b>", // Optional HTML content
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email:", error);
  } else {
    console.log("Email sent successfully:", info.response);
  }
});
