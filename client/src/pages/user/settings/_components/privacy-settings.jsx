"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

export function PrivacySettings() {
  const router = useNavigate();
  const { deleteUserAccount, isLoading, error } = useUserStore();
  const { token, checkAuth } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);

  const [settings, setSettings] = useState({
    dataCollection: true,
    cookieUsage: true,
    profileVisibility: false,
    activityTracking: true,
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      if (!token) {
        toast.error("Authentication required", {
          description: "Please login to access privacy settings",
        });
        router("/login");
      }
    };

    verifyAuth();
  }, [checkAuth, router, token]);

  // Reset error when dialog opens/closes
  useEffect(() => {
    setDeleteError("");
  }, [isDeleteDialogOpen]);

  // Watch for errors from the store
  useEffect(() => {
    if (error) {
      setDeleteError(error);
    }
  }, [error]);

  const handleToggle = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Privacy settings saved", {
      description: "Your privacy preferences have been updated",
    });
    console.log("Privacy settings saved", settings);
  };

  const handleDeleteAccount = async () => {
    if (!confirmPassword) {
      setDeleteError("Password is required");
      return;
    }

    try {
      // Logout and redirect
      await logout();
      // Use the store's deleteUserAccount function with the password
      await deleteUserAccount(confirmPassword, router.push);

      // If no error was set in the store, we can assume success
      if (!error) {
        // Close dialog
        setIsDeleteDialogOpen(false);

        // Show success message
        toast.success("Account deleted", {
          description: "Your account has been permanently deleted",
        });

        navigate("/");
      }
    } catch (err) {
      // This catch is just a fallback, as errors should be handled in the store
      setDeleteError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="data-collection">Data Collection</Label>
            <p className="text-sm text-muted-foreground">
              Allow us to collect data to improve your experience.
            </p>
          </div>
          <Switch
            id="data-collection"
            checked={settings.dataCollection}
            onCheckedChange={() => handleToggle("dataCollection")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="cookie-usage">Cookie Usage</Label>
            <p className="text-sm text-muted-foreground">
              Allow us to use cookies to personalize content.
            </p>
          </div>
          <Switch
            id="cookie-usage"
            checked={settings.cookieUsage}
            onCheckedChange={() => handleToggle("cookieUsage")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="profile-visibility">Profile Visibility</Label>
            <p className="text-sm text-muted-foreground">
              Make your profile visible to other users.
            </p>
          </div>
          <Switch
            id="profile-visibility"
            checked={settings.profileVisibility}
            onCheckedChange={() => handleToggle("profileVisibility")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="activity-tracking">Activity Tracking</Label>
            <p className="text-sm text-muted-foreground">
              Allow us to track your activity for personalized recommendations.
            </p>
          </div>
          <Switch
            id="activity-tracking"
            checked={settings.activityTracking}
            onCheckedChange={() => handleToggle("activityTracking")}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Account Actions</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Download Your Data</Label>
            <p className="text-sm text-muted-foreground">
              Get a copy of all the data we have about you.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Download
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Delete Account</Label>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all your data.
            </p>
          </div>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="py-4">
                <Label htmlFor="confirm-password" className="mb-2 block">
                  Enter your password to confirm
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Your current password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mb-2"
                />
                {deleteError && (
                  <p className="text-sm text-destructive mt-1">{deleteError}</p>
                )}
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteAccount();
                  }}
                  disabled={isLoading || !confirmPassword}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Button type="submit">Save Privacy Settings</Button>
    </form>
  );
}
