const  nodemailer = require("nodemailer");

const sendEmail = async options => {
 try {
 const transporter = nodemailer.createTransport({
 host: process.env.HOST,
port: 2525,
auth: {
user: process.env.USER,
pass: process.env.PASS,
}, });

await transporter.sendMail({
 from:`GEBEYA.com<${process.env.EMAIL}>`,
 to: options.email,
subject:options.subject,
text: options.message });

console.log("email sent sucessfully");
} catch (error) {
 console.log(error, "email not sent"); } };

 module.exports = sendEmail;





module.exports=sendEmail;