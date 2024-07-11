import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
        customColor: {
          innovatio: "#e6eeff",
          innovatio2: "#d8e6fe",
          innovatio3: "#000000",
          innovatio4: "#eef4ff",
          letras: "#fec116",
          header:'#000916',
        },
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
      },
      backgroundImage: {
        gradient:
          "linear-gradient(to top,#061D34, #103253,#CDD4E1,#D8E1EB,#CDD4E1,#CCD9F1,#A5BCE7, #8AA6DA,#CDD4E1, #103253,#061D34)",
          gradient5:
          "linear-gradient(to top,#061D34, #103253,#CDD4E1,#D8E1EB,#CDD4E1,#CCD9F1,#A5BCE7, #8AA6DA,#CDD4E1, #061D34)",
          gradient3:
          "radial-gradient(circle,#ffffff,#ECF0F7,#D8E1EB,#CDD4E1,#CCD9F1,#A5BCE7, #8AA6DA,#1A5285, #103253,#061D34)",
          gradient2:
          "linear-gradient(to bottom #061D34, #103253,#CDD4E1,#D8E1EB,#CDD4E1,#CCD9F1,#A5BCE7, #8AA6DA,#CDD4E1, #103253,#061D34)",
          gradient4:
          "linear-gradient(to bottom,#FFFFFF,#CDD4E1,#CCD9F1,#A5BCE7, #8AA6DA,#1A5285)",
      },
      borderRadius: { 
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
