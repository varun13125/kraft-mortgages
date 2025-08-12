import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0C2B5A",
          blueLight: "#194785",
          gold: "#D8A425"
        }
      },
      boxShadow: {
        card: "0 6px 24px rgba(0,0,0,0.06)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
export default config;
