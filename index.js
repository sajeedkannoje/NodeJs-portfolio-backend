const nodemailer = require('nodemailer');
require('dotenv').config();
const cors = require('cors');
const express = require("express");
const app = express();
const {
  body,
  validationResult
} = require('express-validator');
const corsOpts = {
  origin: '*',
  methods: [
    'GET',
    'POST',
  ],
  allowedHeaders: [
    'Content-Type',
  ],
};

app.use(cors(corsOpts));
app.use(express.json());
const port = process.env.PORT || 5000;

app.post('/sendmail',
  body('firstname').isString().not().isEmpty().trim().escape(),
  body('lastname').isString().not().isEmpty().trim().escape(),
  body('email').isEmail().normalizeEmail().not().isEmpty().trim().escape(),
  body('phone').isNumeric().not().isEmpty().trim().escape(),
  body('message').not().isEmpty().trim().escape(),
  async (req, resp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({
        errors: errors.array()
      });
    }
    const {
      firstname,
      lastname,
      email,
      phone,
      message
    } = req.body;
    try {
      const transporter = nodemailer.createTransport({
        port: 465, // true for 465, false for other ports
        host: "smtp.gmail.com",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
        secure: true,
      });
      const mailData = {
        from: process.env.EMAIL, // sender address
        to: process.env.EMAIL, // list of receivers
        subject: 'Enquiry from React portfolio',
        text: 'Web Bug',
        html: `
          <table class="tg">
          <thead>
            <tr>
              <th class="tg-baqh"><span style="font-weight:bold">First name</span></th>
              <th class="tg-0lax"><span style="font-weight:bold">Last Name</span></th>
              <th class="tg-0lax"><span style="font-weight:bold">Email</span></th>
              <th class="tg-0lax"><span style="font-weight:bold">Phone</span></th>
              <th class="tg-0lax"><span style="font-weight:bold">Message</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="tg-baqh">${firstname}</td>
              <td class="tg-0lax">${lastname}</td>
              <td class="tg-0lax">${email}</td>
              <td class="tg-0lax">${phone}</td>
              <td class="tg-0lax">${message}</td>
            </tr>
          </tbody>
          </table>`,
      };
      transporter.sendMail(mailData, function (err, info) {
        if (err) {
          resp.send(err).statusCode(400);
        } else {
          resp.send({
            'success': true,
            'message': 'mail send successfully.'
          }).statusCode(200)
        }
      });
    } catch (error) {
      resp.send({
        "status": false,
        "message": "Internal server error!"
      }).statusCode(500)
    }
  });

app.get('/', async (req, resp) => {

  resp.send({
    "start": 'App start'
  })
})


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
