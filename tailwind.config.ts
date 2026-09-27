import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Design system — warm cream "paper diary" palette, inspired by a
        // hand-journaled "today mood" moodboard: textured cream paper, deep
        // maroon ink-line doodles, postage-stamp photo frames.
        paper: "#F2E8D8", // primary background — warm cream paper
        cream: "#FBF5E9", // lighter surface — cards, buttons-on-dark text
        panel: "#EAD9C4", // secondary background — soft tan panel
        blush: "#F1D6C9", // secondary background alt — soft terracotta panel
        ink: "#2B211B", // primary text / outlines — warm near-black
        cocoa: "#5A3625", // secondary ink — deep coffee brown
        muted: "#8C7A67", // muted text — warm taupe
        cherry: "#8A2A2E", // primary accent — deep maroon, the "doodle red"
        rust: "#8A2A2E",
        butter: "#D2A15A", // accent — croissant gold
        pink: "#C98A82", // sticker color — dusty rose
        sage: "#8FA06B", // sticker color — muted olive
        sky: "#8FA6B0", // sticker color — dusty blue
        lavender: "#9C7E6B", // sticker color — warm mocha-mauve
        filmwhite: "#FFFDF7", // photo mat / stamp border white
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        label: ["var(--font-label)", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
        script: ["var(--font-script)", "cursive"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        film: "0 2px 0 rgba(30,22,16,0.06), 0 18px 36px -18px rgba(30,22,16,0.45)",
        booth: "0 40px 70px -30px rgba(30,22,16,0.5)",
        stamp: "3px 3px 0 0 #2B211B",
        "stamp-sm": "2px 2px 0 0 #2B211B",
        "stamp-lg": "5px 5px 0 0 #2B211B",
        tactile: "0 1px 0 rgba(30,22,16,0.18)",
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
