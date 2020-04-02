// var nodemailer = require('nodemailer');
function sendMailToUser(Name,Email,Description) {
  console.log("in other file");
  console.log(Name);

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
      var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'solace.pune1@gmail.com',
        pass: 'solace@123'
      }
    });

    var mailOptions = {
      from: 'solace.pune1@gmail.com',
      to: Email,
      subject: Description,
      text: 'Sending Email using Node.js'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });


}


module.exports = sendMailToUser;
