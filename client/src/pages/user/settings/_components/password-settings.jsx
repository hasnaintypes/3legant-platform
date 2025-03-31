"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function PasswordSettings({ email }) {
  const navigate = useNavigate();
  const { changePassword, isLoading, error } = useUserStore();
  const { token, checkAuth } = useAuthStore();

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      if (!token) {
        toast.error("Authentication required", {
          description: "Please login to change your password",
        });
        navigate("/login");
      }
    };

    verifyAuth();
  }, [checkAuth, navigate, token]);

  const handleInputChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    if (success) setSuccess(false);
    if (validationError) setValidationError("");
  };

  const validatePasswords = () => {
    if (passwords.newPassword.length < 8) {
      setValidationError("New password must be at least 8 characters long");
      return false;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setValidationError("New passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setSuccess(false);
    setValidationError("");

    // Validate passwords
    if (!validatePasswords()) {
      return;
    }

    // Check if token exists
    if (!token) {
      toast.error("Authentication required", {
        description: "Please login to change your password",
      });
      navigate("/login");
      return;
    }

    // Call the changePassword function from the store
    await changePassword({
      oldPassword: passwords.oldPassword,
      newPassword: passwords.newPassword,
    });

    // Check for errors
    if (error) {
      toast.error("Password change failed", {
        description: error,
      });

      // If token is invalid, redirect to login
      if (
        error.includes("token") ||
        error.includes("authentication") ||
        error.includes("unauthorized")
      ) {
        navigate("/login");
      }

      return;
    }

    // Success
    setSuccess(true);
    toast.success("Password updated", {
      description: "Your password has been changed successfully",
    });

    // Reset form
    setPasswords({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Your password has been updated successfully.
          </AlertDescription>
        </Alert>
      )}

      {validationError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">
            {validationError}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-display">Email</Label>
          <Input id="email-display" value={email} readOnly disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input
            id="current-password"
            name="oldPassword"
            type="password"
            value={passwords.oldPassword}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            name="newPassword"
            type="password"
            value={passwords.newPassword}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            value={passwords.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </div>
  );
}
