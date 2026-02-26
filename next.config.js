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
  trailingSlash: false,
  async redirects() {
    return [
      // www → non-www redirect
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.esportsmice.com" }],
        destination: "https://esportsmice.com/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
