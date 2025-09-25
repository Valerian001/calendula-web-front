import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
				port: "", // leave empty for default
				pathname: "/**", // allow all paths under the domain
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				port: "", // leave empty for default
				pathname: "/**", // allow all paths under the domain
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
