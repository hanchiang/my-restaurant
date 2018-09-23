const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

exports.sendMail = async ({to, name, url}) => {
  const text = `Hello ${name}!. You have requested to reset your password. Follow this link to proceed: ${url}`;
  const html = `
    <p>Hello ${name}!</p>
    <p>You have requested to reset your password. Follow this link to proceed: <a href=${url}>reset password</a></p>
  `;

  const mailOptions = {
    from: 'Han restaurant <hans-restaurant@hotmail.com>',
    subject: 'Han restaurant: Password Reset',
    to,
    text,
    html
  }

  await transporter.sendMail(mailOptions);
}