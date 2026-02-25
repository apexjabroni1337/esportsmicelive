/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "img.icons8.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
  compress: true,
};

module.exports = nextConfig;
