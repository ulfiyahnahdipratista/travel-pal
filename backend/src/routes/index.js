// File: src/routes/index.js
import destinasiRoutes from "./destinasi.js";
import kulinerRoutes from "./kuliner.js";
import favoritRoutes from "./favorit.js";
import surveyRoutes from "./survey.js";

export default [
  ...destinasiRoutes,
  ...kulinerRoutes,
  ...favoritRoutes,
  ...surveyRoutes,
];
