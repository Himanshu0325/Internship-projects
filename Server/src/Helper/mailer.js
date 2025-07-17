import nodemailer from 'nodemailer';

export default async function Mailer(email ,otp , encriptedEmail){
  try {
    const transport =  nodemailer.createTransport(
      {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT) || 587,
        secure: Number(process.env.MAIL_PORT) === 465, // true for 465, false for other ports
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        // Additional options for better Vercel compatibility
        pool: false, // Disable connection pooling for serverless
        maxConnections: 1,
        maxMessages: 1,
        connectionTimeout: 60000, // 60 seconds
        greetingTimeout: 30000, // 30 seconds
        socketTimeout: 60000, // 60 seconds
      } 
    );

    console.log('Verifying transporter...');
    await transport.verify();
    console.log('Transporter verified successfully');

    const encodedEmail = encodeURIComponent(encriptedEmail);

    const emailOption = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Email Verification",
      text: otp ? `Thank You joining Our Organization! here is your OTP : ${otp}` : `click the link to verify ${`http://localhost:5173/verify/?VerifyingEmail=${encodedEmail}`}`,
    };

    console.log("Sending emails...");

    // Send both emails with proper error handling
    const emailPromises = await transport.sendMail(emailOption).catch(error => {
      console.error('Error sending confirmation email:', error);
    })

    

  } catch (error) {
    console.log(error);
    
  }
}