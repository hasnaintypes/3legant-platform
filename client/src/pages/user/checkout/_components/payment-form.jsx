import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  {
    id: "credit_card",
    name: "Credit Card",
    description: "Pay with your credit card",
  },
  { id: "paypal", name: "PayPal", description: "Pay with your PayPal account" },
];

const PaymentForm = ({ onSubmit, initialData }) => {
  const [selectedMethod, setSelectedMethod] = useState(
    initialData?.method || "credit_card"
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      onSubmit({
        method: selectedMethod,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Failed to process payment information",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
        <RadioGroup
          value={selectedMethod}
          onValueChange={setSelectedMethod}
          className="space-y-4"
        >
          {PAYMENT_METHODS.map((method) => (
            <div
              key={method.id}
              className="flex items-center space-x-3 border rounded-lg p-4"
            >
              <RadioGroupItem value={method.id} id={method.id} />
              <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                <div className="font-medium">{method.name}</div>
                <div className="text-sm text-muted-foreground">
                  {method.description}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full" disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Continue"}
      </Button>
    </form>
  );
};

export default PaymentForm;
