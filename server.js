require('dotenv').config();

const express = require('express');
const app = express();

// Set Credentials for Twilio Account
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// Set credentials for SendGrid Account
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor en linea, realice sus solicites a través de la API');
});

app.post('/sms', (req, res) => {
  // Read parameters from body
  const { smsBody, recipient } = req.body;
  const msg = {
    body: smsBody,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: '+57' + recipient,
  };

  client.messages
    .create(msg)
    .then((message) => {
      console.log(message.sid);
      res.json({ message: 'success' });
    })
    .catch((error) => {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    });
});

app.post('/email', (req, res) => {
  // Read params from body
  const { recipient, subject, emailBody } = req.body;

  const msg = {
    to: recipient, // Change to your recipient
    from: process.env.SENDGRID_VERIFIED_SENDER, // Change to your verified sender
    subject: subject,
    text: emailBody,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('email sent');
      res.json({ message: 'Email sent' });
    })
    .catch((error) => {
      console.log(error.message);
      res.json({ message: error.message });
    });
});

app.listen(5000, () => {
  console.log('Server listening at port 5000...');
});
