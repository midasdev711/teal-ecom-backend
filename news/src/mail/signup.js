// var nodemailer = require('nodemailer');
var nodemailer = require("nodemailer");
var { MAIL_DETAILS } = require("../constant");

function sendMailToUser(Name, Email, Description) {
  console.log("in other file", Name);
  console.log(Email);

  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

  var transporter = nodemailer.createTransport({
    service: MAIL_DETAILS.service,
    port: MAIL_DETAILS.Port,
    secure: true,
    options: { debug: true },
    auth: {
      user: MAIL_DETAILS.User,
      pass: MAIL_DETAILS.Password,
    },
  });

  var mailOptions = {
    from: MAIL_DETAILS.User,
    to: Email,
    subject: Description,
    text: "Sending Email using Node.js",
  };

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) console.log(error);
    else console.log("Server is ready to take our messages");
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = sendMailToUser;
