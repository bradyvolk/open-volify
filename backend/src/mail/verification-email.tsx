interface VerificationEmailProps {
  email: string;
  verificationToken: string;
}

export const VerificationEmail = ({ email, verificationToken }: VerificationEmailProps) => (
  <div>
    <h1>Welcome, {email}!</h1>
    <p>Please click the link below to verify your email:</p>
    <a
      href={`${
        process.env.NODE_ENV === "production" ? window.location.origin : "http://localhost:3006"
      }/verify-email?token=${verificationToken}`}
    >
      Verify Email
    </a>
  </div>
);
