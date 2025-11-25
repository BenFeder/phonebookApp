// Email functionality disabled for development
// To enable: install nodemailer and configure EMAIL_PASSWORD in .env

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  // Development mode: Just log the verification URL to console
  console.log("\n=== EMAIL VERIFICATION (Development Mode) ===");
  console.log("To:", email);
  console.log("Verification URL:", verificationUrl);
  console.log("Copy this URL to verify your account:");
  console.log(verificationUrl);
  console.log("===========================================\n");

  return Promise.resolve();
};
