/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https', // Specify the protocol (e.g., 'https')
        hostname: 'res.cloudinary.com', // Specify the allowed hostname
        port: '', // Optional: Specify a port if needed (empty string for default)
        pathname: '/ds5yx83ww/image/upload/**/ecommerce/products/**', // Optional: Use wildcards for specific paths
      }
    ],
  },
};

export default nextConfig;
