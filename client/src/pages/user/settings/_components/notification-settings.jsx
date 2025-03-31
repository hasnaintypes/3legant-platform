import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailMarketing: true,
    emailOrders: true,
    emailAccount: true,
    pushNewProducts: false,
    pushOrders: true,
    pushReminders: true,
  });

  const handleToggle = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Notification settings saved", settings);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Email Notifications</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-marketing">Marketing emails</Label>
            <p className="text-sm text-muted-foreground">
              Receive emails about new products, features, and more.
            </p>
          </div>
          <Switch
            id="email-marketing"
            checked={settings.emailMarketing}
            onCheckedChange={() => handleToggle("emailMarketing")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-orders">Order updates</Label>
            <p className="text-sm text-muted-foreground">
              Receive emails about your orders, shipping, and deliveries.
            </p>
          </div>
          <Switch
            id="email-orders"
            checked={settings.emailOrders}
            onCheckedChange={() => handleToggle("emailOrders")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-account">Account updates</Label>
            <p className="text-sm text-muted-foreground">
              Receive emails about your account activity and security.
            </p>
          </div>
          <Switch
            id="email-account"
            checked={settings.emailAccount}
            onCheckedChange={() => handleToggle("emailAccount")}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Push Notifications</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-products">New products</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when new products are available.
            </p>
          </div>
          <Switch
            id="push-products"
            checked={settings.pushNewProducts}
            onCheckedChange={() => handleToggle("pushNewProducts")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-orders">Order updates</Label>
            <p className="text-sm text-muted-foreground">
              Get notified about your order status and delivery updates.
            </p>
          </div>
          <Switch
            id="push-orders"
            checked={settings.pushOrders}
            onCheckedChange={() => handleToggle("pushOrders")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-reminders">Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Get notified about items in your cart and wishlist.
            </p>
          </div>
          <Switch
            id="push-reminders"
            checked={settings.pushReminders}
            onCheckedChange={() => handleToggle("pushReminders")}
          />
        </div>
      </div>

      <Button type="submit">Save Preferences</Button>
    </form>
  );
}
