import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  return (
    <section className="bg-primary  text-primary-foreground py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the 3legant Community
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Subscribe to our newsletter and be the first to know about our
            latest collections, exclusive offers, and insider tips.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1 gap-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                required
              />
            </div>
            <Button type="submit" variant="secondary" className="sm:w-auto">
              Subscribe
            </Button>
          </form>

          <p className="mt-4 text-sm text-primary-foreground/60">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  );
}
