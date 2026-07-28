import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleCheckIcon } from "lucide-react";
import { Link } from "react-router";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length (Better Auth requires min 8 characters)
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signUpError } = await authClient.signUp.email({
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
        callbackURL:
          process.env.NODE_ENV === "production"
            ? window.location.origin
            : "http://localhost:3001",
      });

      if (signUpError) {
        switch (signUpError.code) {
          case "EMAIL_ALREADY_EXISTS":
            setError("An account with this email already exists");
            break;
          case "INVALID_EMAIL":
            setError("Please enter a valid email address");
            break;
          case "WEAK_PASSWORD":
            setError("Password is too weak. Please choose a stronger password");
            break;
          default:
            setError(signUpError.message || "Failed to sign up");
            break;
        }
        setIsLoading(false);
        return;
      }

      // Redirect to verification sent page
      setIsVerificationSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setIsLoading(false);
    }
  };

  if (isVerificationSent) {
    return (
      <div>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Verification Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <CircleCheckIcon className="h-12 w-12 text-green-500" />
            </div>
            <p className="text-center mt-4 text-muted-foreground">
              Please check your email for a verification link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="space-y-8 border-b pb-8">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={8}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
            </div>
          </form>

          <div className="pt-4">
            Already have an account?
            <Button variant="link">
              <Link to="/sign-in">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
