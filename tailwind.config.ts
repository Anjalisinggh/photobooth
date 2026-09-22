import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Design system — pastel Y2K / vaporwave desktop palette.
        paper: "#F4ECFF", // primary background — pale lavender-white
        cream: "#F4ECFF",
        panel: "#D8F3E7", // secondary background — pastel mint panel
        blush: "#FFDCEA", // secondary background alt — soft pink panel
        ink: "#2E1A47", // primary text / chunky sticker outlines — deep indigo-purple
        cocoa: "#4B2E83", // deep purple — secondary ink / deep accents
        muted: "#8E7FAE", // muted text
        cherry: "#FF5FA2", // primary accent — hot pink/magenta, the "stamp" color
        rust: "#FF5FA2",
        butter: "#FFD35C", // accent — golden yellow
        pink: "#FF8FC7", // sticker color — bubblegum pink
        sage: "#7FE0C0", // sticker color — bright mint
        sky: "#8FD8FF", // sticker color — sky blue
        lavender: "#B79CF0", // sticker color — vivid lavender-purple
        filmwhite: "#FFFBF5", // photo mat / polaroid border white
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        label: ["var(--font-label)", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        film: "0 2px 0 rgba(36,26,18,0.05), 0 18px 36px -18px rgba(36,26,18,0.4)",
        booth: "0 40px 70px -30px rgba(36,26,18,0.5)",
        stamp: "3px 3px 0 0 #2E1A47",
        "stamp-sm": "2px 2px 0 0 #2E1A47",
        "stamp-lg": "5px 5px 0 0 #2E1A47",
        tactile: "0 1px 0 rgba(36,26,18,0.15)",
      },
      borderRadius: {
        blob: "255px 15px 225px 15px / 15px 225px 15px 255px",
      },
      keyframes: {
        flash: {
          "0%": { opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(var(--rot, 0deg))" },
          "50%": { transform: "translateY(-10px) rotate(var(--rot, 0deg))" },
        },
        "pulse-soft": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -3%)" },
          "20%": { transform: "translate(-4%, 2%)" },
          "30%": { transform: "translate(2%, -4%)" },
          "40%": { transform: "translate(-2%, 5%)" },
          "50%": { transform: "translate(-4%, 2%)" },
          "60%": { transform: "translate(3%, 0)" },
          "70%": { transform: "translate(0, 3%)" },
          "80%": { transform: "translate(-3%, 0)" },
          "90%": { transform: "translate(2%, 2%)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.4", transform: "scale(0.85) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1.1) rotate(12deg)" },
        },
        "hero-flash": {
          "0%, 92%, 100%": { opacity: "0" },
          "95%": { opacity: "0.45" },
        },
      },
      animation: {
        flash: "flash 450ms ease-out",
        "fade-up": "fade-up 600ms ease-out both",
        "fade-in": "fade-in 500ms ease-out both",
        float: "float 5s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3.2s ease-in-out infinite",
        grain: "grain 1.1s steps(8) infinite",
        sparkle: "sparkle 2.4s ease-in-out infinite",
        "hero-flash": "hero-flash 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
