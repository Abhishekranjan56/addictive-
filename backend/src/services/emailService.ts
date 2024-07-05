import nodemailer from 'nodemailer';

export async function sendWelcomeEmail(email: string, firstName: string, lastName: string, mobileNo: string, password: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: 'ranjanab321@gmail.com',
      pass: 'ydam sska dpit iduv', 
    },
  });

  const mailOptions = {
    from: 'ranjanab321@gmail.com',
    to: email,
    subject: 'Welcome to Our Service',
    html: `Thank you for creating an account, ${firstName} ${lastName}.<br>Your email is: ${email}<br>Your mobile number is: ${mobileNo}<br>Your generated password is: ${password}<br><a href="YOUR_LOGIN_URL">Login here</a>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}
