import { ComingSoon } from "@/components/shared/coming-soon";

export function BlogPage() {
  return (
    <ComingSoon
      title="Blog Management"
      description="Create engaging blog posts, manage categories, and boost your SEO with our upcoming blog management system."
      returnPath="/admin/dashboard"
      returnLabel="Back to Dashboard"
      estimatedTime="Coming in 6 weeks"
    />
  );
}

export default BlogPage;
