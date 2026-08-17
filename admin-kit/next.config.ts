import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // the form-only home editor was replaced by the visual editor
    return [
      { source: "/admin/home-editor", destination: "/admin/edit", permanent: true },
      { source: "/admin/branding", destination: "/admin/theme#brand", permanent: true },
      { source: "/admin/content", destination: "/admin/content", permanent: false }, // kept: linked from Edit Home
    ].filter((r) => r.source !== r.destination);
  },
};

export default nextConfig;
