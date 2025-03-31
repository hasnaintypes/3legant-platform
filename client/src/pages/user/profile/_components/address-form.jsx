"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function AddressForm({ address, onAddressChange }) {
  const [localAddress, setLocalAddress] = useState(address);

  // Update local state when props change
  useEffect(() => {
    setLocalAddress(address);
  }, [address]);

  const handleInputChange = (e) => {
    const updatedAddress = { ...localAddress, [e.target.name]: e.target.value };
    setLocalAddress(updatedAddress);
    onAddressChange(updatedAddress);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Shipping Information</h3>

      <div className="space-y-2">
        <Label htmlFor="fullAddress">Full Address</Label>
        <Textarea
          id="fullAddress"
          name="street"
          value={localAddress.street || ""}
          onChange={handleInputChange}
          placeholder="Enter your complete address"
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip/Postal Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={localAddress.zipCode || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={localAddress.city || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
}
