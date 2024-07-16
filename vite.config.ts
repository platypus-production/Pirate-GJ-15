import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [viteTsConfigPaths()],
	base: process.env.NODE_ENV === "production" ? "/Pirate-GJ-15/" : undefined,
	server: {
		port: 1337,
		host: "localhost",
	},
	preview: {
		port: 4400,
		host: "localhost",
	},
});
