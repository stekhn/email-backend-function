const functions = require("@google-cloud/functions-framework");
const nodemailer = require("nodemailer");
const config = require("dotenv").config();

const { EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_USER, EMAIL_PASSWORD } =
  process.env;

const mailer = nodemailer.createTransport({
  host: EMAIL_SMTP_HOST,
  port: EMAIL_SMTP_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
  secure: true,
});

functions.http("send", (req, res) => {
  if (req.body && req.body.email) {
    const email = {
      sender: req.body.name,
      from: req.body.email,
      to: [EMAIL_USER],
      subject: req.body.subject || "[No subject]",
      html: req.body.message || "[No message]",
    };

    mailer.sendMail(email, (error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send("Email sent");
      }
    });
  } else {
    return res.status(400).send("Request body is undefined");
  }

  res.end();
});
