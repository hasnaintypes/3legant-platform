import { MapPin, Home } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CustomerAddress({ customer }) {
  const hasAddress = customer.address || customer.city || customer.postalCode;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Address Information</CardTitle>
        <CardDescription>
          Customer's shipping and billing address
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasAddress ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Home className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-medium">No Address</h3>
            <p className="text-sm text-muted-foreground">
              This customer hasn't provided an address yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Primary Address</h3>
              </div>
              <div className="space-y-1 text-sm">
                {customer.address && <p>{customer.address}</p>}
                {(customer.city || customer.postalCode) && (
                  <p>
                    {customer.city}
                    {customer.city && customer.postalCode && ", "}
                    {customer.postalCode}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
