/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Skip TypeScript and ESLint during quick dev builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
