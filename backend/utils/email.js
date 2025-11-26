import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  // Validate environment variables
  if (!process.env.EMAIL_USER) {
    throw new Error("EMAIL_USER is not configured");
  }
  if (!process.env.EMAIL_PASSWORD) {
    throw new Error("EMAIL_PASSWORD (App Password) is not configured");
  }

  console.log(
    `Attempting to send email to ${email} from ${process.env.EMAIL_USER}`
  );

  // Create transporter with SendGrid SMTP (more reliable for cloud hosting)
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
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
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully to:", email);
    console.log("Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("=== EMAIL SENDING ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    if (error.response) {
      console.error("SMTP Response:", error.response);
    }
    if (error.responseCode) {
      console.error("Response Code:", error.responseCode);
    }
    console.error("Full error object:", JSON.stringify(error, null, 2));
    console.error("=========================");
    throw error;
  }
};
