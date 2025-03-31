import { ComingSoon } from "@/components/shared/coming-soon";

export function ContentPagesPage() {
  return (
    <ComingSoon
      title="Content Pages"
      description="Create and manage custom pages for your store including About Us, Contact, FAQs, and more."
      returnPath="/admin/dashboard"
      returnLabel="Back to Dashboard"
      estimatedTime="Coming in 3 weeks"
    />
  );
}

export default ContentPagesPage;
