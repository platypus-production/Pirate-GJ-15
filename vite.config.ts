import {defineConfig} from 'vite'
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 1337,
    host: 'localhost'
  },
  preview: {
		port: 4400,
		host: "localhost",
	},

  plugins: [
    viteTsConfigPaths(),
  ],

	build: {
		reportCompressedSize: true,
		commonjsOptions: {
			transformMixedEsModules: true,
		},
	},
})