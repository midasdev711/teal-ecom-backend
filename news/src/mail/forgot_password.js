const { RoleObject,MAIL_DETAILS,AWSCredentails } = require('../constant');


function sentForgotPasswordMail( EmailObject ) {
  try {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: MAIL_DETAILS.service,
        port: MAIL_DETAILS.Port,
        secure: true,
        options: {	debug: true },
        auth: {
            user: MAIL_DETAILS.User,
            pass: MAIL_DETAILS.Password
      }
    });

    // verify connection configuration
    transporter.verify(function(error, success) {
       if (error) console.log(error);
       else console.log('Server is ready to take our messages');
    });

    var mailOptions = {
      from: MAIL_DETAILS.User,
      to: EmailObject.Email,
      subject: EmailObject.Subject,
      text:
          '<body>Sending Email from server using Node.js'+
          '<h2>Reset Password</h2>'+
          ' Please the link below to active it will get decative after an hr. '+EmailObject.Description+". "+
          MAIL_DETAILS.HTTP_RESET_URL+'/'+EmailObject.UniqueLinkKey+'</body>'
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error)   console.log(error);
      else console.log('Email sent: ' + info.response);
    });
  } catch (e) { console.log(e); }
}


module.exports = sentForgotPasswordMail;
