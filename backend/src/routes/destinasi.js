// File: src/routes/destinasi.js
import {
  getDestinasiByTipe,
  getDestinasiById,
  getDestinasiList,
} from "../controller/destinasi.js";

export default [
  {
    method: "POST",
    path: "/destinasi",
    handler: getDestinasiByTipe,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/destinasi/list",
    handler: getDestinasiList,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/destinasi",
    handler: getDestinasiById,
    options: {
      auth: "jwt",
    },
  },
];
