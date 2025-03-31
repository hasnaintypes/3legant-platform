"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddressForm } from "./_components/address-form";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import { uploadFile } from "@/utils/uploadFile";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function ProfilePage() {
  const navigate = useNavigate(); // Use navigate instead of router
  const { user, isLoading, error, fetchUserProfile, updateUserProfile } =
    useUserStore();
  const { token, checkAuth } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    avatar: "",
    address: "",
    postalCode: "",
    city: "",
  });

  useEffect(() => {
    const init = async () => {
      await checkAuth();

      if (!token) {
        toast.error("Authentication required", {
          description: "Please login to access your profile",
        });
        navigate("/login"); // Replaced router.push with navigate
        return;
      }

      fetchUserProfile();
    };

    init();
  }, [checkAuth, fetchUserProfile, navigate, token]);

  useEffect(() => {
    if (user) {
      setFormData({
        avatar: user.user.avatar || "",
        address: user.user.address || "",
        postalCode: user.user.postalCode || "",
        city: user.user.city || "",
      });
    }
  }, [user]);

  const handleAvatarChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setIsUploading(true);
        const file = e.target.files[0];
        const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_PROFILE;

        if (!bucketId) {
          throw new Error("Appwrite bucket ID is not configured");
        }

        if (!token) {
          throw new Error("Authentication required");
        }

        const result = await uploadFile(file, bucketId);

        if (result.success) {
          setFormData((prev) => ({ ...prev, avatar: result.url }));
          toast.success("Profile picture updated");
        } else {
          throw new Error(result.error || "Failed to upload avatar");
        }
      } catch (error) {
        toast.error("Upload failed", {
          description: error.message || "Failed to upload avatar",
        });

        if (
          error.message === "Authentication required" ||
          error.response?.status === 401
        ) {
          navigate("/login"); // Replaced router.push with navigate
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Authentication required", {
        description: "Please login to update your profile",
      });
      navigate("/login"); // Replaced router.push with navigate
      return;
    }

    await updateUserProfile(formData);

    if (!error) {
      toast.success("Profile updated");
    } else {
      toast.error("Update failed", { description: error });

      if (
        error.includes("token") ||
        error.includes("authentication") ||
        error.includes("unauthorized")
      ) {
        navigate("/login"); // Replaced router.push with navigate
      }
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your account settings and personal information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={formData.avatar || "/placeholder.svg?height=80&width=80"}
                  alt="Profile avatar"
                />
                <AvatarFallback>
                  {user?.user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                className="relative cursor-pointer"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Change Avatar"
                )}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleAvatarChange}
                  accept="image/*"
                  disabled={isUploading}
                />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={user?.user.email || ""}
                readOnly
              />
            </div>

            <AddressForm
              address={{
                street: formData.address,
                zipCode: formData.postalCode,
                city: formData.city,
                notes: "",
              }}
              onAddressChange={(addressData) =>
                setFormData((prev) => ({
                  ...prev,
                  address: addressData.street,
                  postalCode: addressData.zipCode,
                  city: addressData.city,
                }))
              }
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading || isUploading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save changes"
          )}
        </Button>
        {error && <p className="text-destructive ml-4">{error}</p>}
      </CardFooter>
    </Card>
  );
}
