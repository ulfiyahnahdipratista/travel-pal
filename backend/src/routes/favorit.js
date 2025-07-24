import { toggleFavorit, getFavoritList } from "../controller/favorit.js";

export default [
  {
    method: "POST",
    path: "/favorit/toggle",
    handler: toggleFavorit,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/favorit",
    handler: getFavoritList,
    options: {
      auth: "jwt",
    },
  },
];
