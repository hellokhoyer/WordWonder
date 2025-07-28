export default {
  content: ["./index.html", "./search.html", "./scripts/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    "loading",
    "player-ready",
    "player-playing",
    "audio-playback",
    "container",
    "content",
    "footer",
    "refresh-word",
    "u-padding-T-xl",
  ],
};
