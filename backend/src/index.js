// File: src/index.js
import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import validateJWT from "./plugins/jwt-auth.js";

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "localhost",
    routes: {
      cors: true,
    },
  });

  await server.register(validateJWT);
  server.route(routes);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
