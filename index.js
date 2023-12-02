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
  const email = {
    sender: req.body.name,
    from: req.body.email,
    to: [EMAIL_USER],
    subject: req.body.subject || "[No subject]",
    html: req.body.message || "[No message]",
  };

  mailer.sendMail(email, function (error, info) {
    if (error) {
      console.error(error);
      return res.status(500).send(error);
    }
    console.info(`Email from ${email.from} was sent to ${email.to}`);
    res.json({ success: true });
  });

  res.send("OK");
});
