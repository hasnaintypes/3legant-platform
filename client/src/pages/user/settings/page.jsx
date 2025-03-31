"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PasswordSettings } from "./_components/password-settings";
import { NotificationSettings } from "./_components/notification-settings";
import { FeedbackForm } from "./_components/feedback-form";
import { PrivacySettings } from "./_components/privacy-settings";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const router = useNavigate();
  const { user, fetchUserProfile } = useUserStore();
  const { token, checkAuth } = useAuthStore();

  // Check authentication and fetch user data on component mount
  useEffect(() => {
    const init = async () => {
      await checkAuth();

      if (!token) {
        toast.error("Authentication required", {
          description: "Please login to access settings",
        });
        router("/login");
        return;
      }

      fetchUserProfile();
    };

    init();
  }, [checkAuth, fetchUserProfile, router, token]);

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-10">
        <section id="password-section">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Password</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Update your password and secure your account
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <PasswordSettings email={user?.user?.email || ""} />
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section id="notifications-section">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Notifications</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Configure how you receive notifications and updates
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <NotificationSettings />
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section id="privacy-section">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Privacy</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your privacy settings and data preferences
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <PrivacySettings />
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section id="feedback-section" className="mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Feedback</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Share your experience and help us improve
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <FeedbackForm userName={user?.user?.name || ""} />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
