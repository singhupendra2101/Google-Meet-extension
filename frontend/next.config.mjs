/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // ✅ export static HTML
  distDir: "out",   // build files out/ folder me aayenge

  // Add this block to disable image optimization for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;