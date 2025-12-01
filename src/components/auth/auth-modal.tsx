"use client";

import { LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GitHubIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  signInWithEmail,
  signInWithGitHub,
  signUpWithEmail,
} from "@/lib/auth/client";
import { signUpEnabled } from "@/lib/config/auth";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOAuthSignIn = async (
    provider: "github",
    signIn: () => Promise<{ error: Error | null }>,
  ) => {
    try {
      setLoading(provider);

      const { error } = await signIn();

      if (error) {
        console.error(`Error signing in with ${provider}:`, error);
        toast.error(`Failed to sign in with ${provider}`);
        setLoading(null);
      }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      toast.error(`Failed to sign in with ${provider}`);
      setLoading(null);
    }
  };

  const handleGitHubSignIn = () =>
    handleOAuthSignIn("github", signInWithGitHub);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    // Prevent sign up if disabled
    if (isSignUp && !signUpEnabled) {
      toast.error("Sign up is currently disabled");
      return;
    }

    try {
      setLoading("email");

      if (isSignUp) {
        const { error } = await signUpWithEmail(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Check your email to confirm your account");
          onOpenChange(false);
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Signed in successfully");
          onOpenChange(false);
        }
      }
    } catch (_error) {
      toast.error("Authentication failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Sign in to continue
          </DialogTitle>
          <DialogDescription>
            You need to be signed in to perform this action
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Email/Password Form */}
          <form className="space-y-4" onSubmit={handleEmailAuth}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                autoComplete="email"
                disabled={!!loading}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                autoComplete={isSignUp ? "new-password" : "current-password"}
                disabled={!!loading}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                type="password"
                value={password}
              />
            </div>

            <Button
              className="w-full"
              disabled={!!loading}
              size="lg"
              type="submit"
            >
              {loading === "email" ? (
                "Loading..."
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {isSignUp ? "Sign Up" : "Sign In"}
                </>
              )}
            </Button>

            {signUpEnabled && (
              <Button
                className="w-full"
                onClick={() => setIsSignUp(!isSignUp)}
                size="sm"
                type="button"
                variant="link"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Need an account? Sign up"}
              </Button>
            )}
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* GitHub OAuth */}
          <Button
            className="w-full"
            disabled={!!loading}
            onClick={handleGitHubSignIn}
            size="lg"
            variant="github"
          >
            {loading === "github" ? (
              "Signing in..."
            ) : (
              <>
                <GitHubIcon />
                Continue with GitHub
              </>
            )}
          </Button>
        </div>

        <div className="text-center text-muted-foreground text-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
}
