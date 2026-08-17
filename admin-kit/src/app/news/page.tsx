import BlogList from "@/components/public/BlogList";

export const dynamic = "force-dynamic";

export default function NewsPage() {
  return <BlogList kicker="Industry news" title="Latest drops & reads" />;
}
