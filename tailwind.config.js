/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	important: "#root",
	theme: {
		extend: {},
		fontFamily: {
			PressStart2P: ['"Press Start 2P"']
		}
	},
	plugins: [],
	corePlugins: {
		preflight: false
	}
};
