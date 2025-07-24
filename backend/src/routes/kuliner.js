// File: src/routes/kuliner.js
import {
  getKulinerByKabupaten,
  getKulinerList,
} from "../controller/kuliner.js";

export default [
  {
    method: "GET",
    path: "/kuliner",
    handler: getKulinerByKabupaten,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/kuliner/list",
    handler: getKulinerList,
    options: {
      auth: "jwt",
    },
  },
];
