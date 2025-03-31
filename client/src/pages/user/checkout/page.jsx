import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import ShippingForm from "./_components/shipping-form";
import PaymentForm from "./_components/payment-form";
import OrderSummary from "./_components/order-summary";
import { Steps } from "./_components/steps";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useOrderStore } from "@/store/useOrderStore";

const steps = [
  { id: 1, name: "Shipping", description: "Enter your shipping details" },
  { id: 2, name: "Payment", description: "Choose your payment method" },
  { id: 3, name: "Review", description: "Review your order" },
];

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShippingSubmit = (data) => {
    setShippingData(data);
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (data) => {
    setPaymentData(data);
    setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!cartItems || !shippingData || !paymentData) {
      toast.error("Missing required information");
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })),
        shippingAddress: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          address: shippingData.address,
          city: shippingData.city,
          postalCode: shippingData.postalCode,
          country: shippingData.country,
          phone: shippingData.phone,
        },
        shippingMethod: "standard",
        paymentMethod: paymentData.method,
        shippingCost: 10,
        totalPrice:
          cartItems.reduce(
            (sum, item) =>
              sum +
              (item.product.finalPrice || item.product.price) * item.quantity,
            0
          ) +
          10 +
          cartItems.reduce(
            (sum, item) =>
              sum +
              (item.product.finalPrice || item.product.price) * item.quantity,
            0
          ) *
            0.1,
      };

      const result = await useOrderStore.getState().createOrder(orderData);

      if (!result) {
        throw new Error("Failed to create order");
      }

      // Clear cart and redirect to success page
      await clearCart();
      window.location.href = `/order-success?orderId=${result.order._id}`;
    } catch (error) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="mb-8">
        <Steps steps={steps} currentStep={currentStep} />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            {currentStep === 1 && (
              <ShippingForm
                onSubmit={handleShippingSubmit}
                initialData={shippingData}
              />
            )}
            {currentStep === 2 && (
              <PaymentForm
                onSubmit={handlePaymentSubmit}
                initialData={paymentData}
              />
            )}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Shipping Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p>{`${shippingData.firstName} ${shippingData.lastName}`}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p>{shippingData.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Address</p>
                      <p>{`${shippingData.address}, ${shippingData.city}, ${shippingData.postalCode}, ${shippingData.country}`}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <p>{paymentData.method}</p>
                </div>

                <Separator />

                <button
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </button>
              </div>
            )}
          </Card>
        </div>

        <div>
          <OrderSummary
            onBack={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            showBackButton={currentStep > 1}
          />
        </div>
      </div>
    </div>
  );
}
