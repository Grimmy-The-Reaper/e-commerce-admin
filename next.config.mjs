/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com", // Correct hostname for Firebase Storage
                port: "", // Optional, leave empty unless your URL includes a specific port
                pathname: "/v0/b/**", // Matches all paths under "/v0/b"
            },
        ],
    },
};

export default nextConfig;
