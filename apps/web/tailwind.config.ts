import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          50: "#ffffff",
          100: "#f8f9fa",
          200: "#e9ecef",
          300: "#dee2e6",
          400: "#ced4da",
          500: "#8e8e93",
          600: "#2d2d2d",
          700: "#1a1a1a",
          800: "#0d0d0d",
          900: "#000000",
        },
        gold: {
          50: "#fffbf0",
          100: "#fef3c7",
          200: "#fcd34d",
          300: "#f59e0b",
          400: "#d97706",
          500: "#d4af37",
          600: "#b8860b",
          700: "#92690f",
          800: "#78421d",
          900: "#5d2e0a",
        },
        accentPalette: {
          50: "#faf5f5",
          100: "#f5e6e8",
          200: "#e8c5ca",
          300: "#e8b4a0",
          400: "#d4a574",
          500: "#c19653",
          600: "#b8860b",
          700: "#8b4513",
          800: "#654321",
          900: "#3d2914",
        },
        term: {
          bg: "#0A1729",
          deep: "#050E1C",
          panel: "#0F1F35",
          footer: "#040810",
          gold: "#C9A96E",
          "gold-bright": "#E8C98A",
          green: "#5FB380",
          red: "#D46A5F",
          text: "#E8E1D2",
          "text-dim": "rgba(232,225,210,0.55)",
          "text-mute": "rgba(232,225,210,0.35)",
          line: "rgba(201,169,110,0.18)",
          "line-dim": "rgba(255,255,255,0.08)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        pulse: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.5",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(201,169,110,0.4), 0 0 60px rgba(201,169,110,0.1)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(201,169,110,0.6), 0 0 100px rgba(201,169,110,0.2)",
          },
        },
        "terminal-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        fadeInScale: {
          "0%": {
            opacity: "0",
            transform: "scale(0.9) translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
          },
        },
        slideInBlur: {
          "0%": {
            transform: "translateX(-100px)",
            filter: "blur(10px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            filter: "blur(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        gradient: "gradient 15s ease infinite",
        shimmer: "shimmer 2s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite",
        "terminal-blink": "terminal-blink 540ms ease-in-out infinite",
        "fade-in-scale": "fadeInScale 0.6s ease-out",
        "slide-in-blur": "slideInBlur 0.8s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
