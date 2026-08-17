import BlogList from "@/components/public/BlogList";

export const dynamic = "force-dynamic";

export default function BlogPage() {
  return <BlogList kicker="From the blog" title="Latest drops & reads" />;
}
