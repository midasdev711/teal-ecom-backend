// var nodemailer = require('nodemailer');
function sendSubscriptionMailToUser( args ) {
  console.log("in other file");
  // console.log(Name);

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
      to: args.UserEmail,
      subject: 'User Subscribe '+args.SubscriptionTitle+' plan',
      text: 'You are successfly subscribe to this '+args.SubscriptionTitle+' plan. It will expire after '+args.Days+' days from now. Amount paid for this plan is '+args.Amount+' '+args.Currency+'.'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });


}


module.exports = sendSubscriptionMailToUser;
