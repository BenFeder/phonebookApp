import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  // Create transporter with SendGrid SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587, // or 465 for SSL, 25 for unencrypted
    secure: false, // true for 465, false for other ports
    auth: {
      user: "apikey", // This is the literal string 'apikey'
      pass: process.env.SENDGRID_API_KEY, // Your SendGrid API key
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify Your Email - Phonebook App",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to Phonebook App!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #6B7280; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #6B7280; font-size: 12px; margin-top: 30px;">
          If you didn't create an account, please ignore this email.
        </p>
      </div>
    `,
  };

  // Send email
  await transporter.sendMail(mailOptions);
  console.log("Verification email sent to:", email);
};
