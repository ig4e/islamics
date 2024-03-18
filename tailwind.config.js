/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			height: {
				'83vh': '83vh',
			},
      fontFamily: {
				'rocknroll': ['RocknRoll One', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
