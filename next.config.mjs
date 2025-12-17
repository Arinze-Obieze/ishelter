
/** @type {import('next').NextConfig} */
const nextConfig = {
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "firebasestorage.googleapis.com",
      port: "",
      pathname: "/**",
    },
  ],
},
  turbopack: {},
};


export default nextConfig;

