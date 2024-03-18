import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
			},
			devOptions: {
				enabled: true,
			},
			manifest: {
				id: "islamics",
				background_color: "#000000",
				categories: ["islam"],
				description: "Life is full of adhans",
				dir: "ltr",
				display: "standalone",
				name: "Islamics",
				lang: "en",
				orientation: "portrait-primary",
				short_name: "Islamics",
				start_url: "/",
				theme_color: "#000000",
			},
		}),
	],
});
