const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port:465 , //if secure is false, it uses 587, by default, and 465 if true
    secure: true,
    requireTLS: true,
    auth: {
      user:process.env.EMAIL_USERNAME ,
      pass:process.env.EMAIL_PASSWORD ,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'E-commerce App <Shtya54@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
