import type { NextConfig } from "next";

const productionOrigin = "https://www.poulomiflorique.co.in";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/florique/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "poulomi-florique-thanisandra.com" }],
        destination: `${productionOrigin}/:path*`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.poulomi-florique-thanisandra.com" }],
        destination: `${productionOrigin}/:path*`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "poulomiflorique.co.in" }],
        destination: `${productionOrigin}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
