/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Increase to 5 MB to handle larger PDFs
    },
  },
};

export default nextConfig;