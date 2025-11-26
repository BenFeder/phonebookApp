import sgMail from "@sendgrid/mail";

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  // Validate environment variables
  if (!process.env.EMAIL_USER) {
    throw new Error("EMAIL_USER is not configured");
  }
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is not configured");
  }

  console.log(
    `Attempting to send email to ${email} from ${process.env.EMAIL_USER}`
  );

  // Set SendGrid API key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: process.env.EMAIL_USER, // Must be verified in SendGrid
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

  try {
    await sgMail.send(msg);
    console.log(`Verification email sent successfully to ${email}`);
  } catch (error) {
    console.error("=== EMAIL SENDING ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    if (error.response) {
      console.error("SendGrid response body:", error.response.body);
    }
    console.error("=========================");
    throw new Error("Failed to send verification email");
  }
};
