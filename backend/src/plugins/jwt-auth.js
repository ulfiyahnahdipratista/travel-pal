// File: src/plugins/jwt-auth.js
import HapiAuthJwt2 from "hapi-auth-jwt2";

const validate = async (decoded, request, h) => {
  if (!decoded?.sub) return { isValid: false };
  return { isValid: true, credentials: { user_id: decoded.sub } };
};

export default {
  name: "jwt-auth",
  version: "1.0.0",
  register: async (server) => {
    await server.register(HapiAuthJwt2);

    server.auth.strategy("jwt", "jwt", {
      key: process.env.SUPABASE_JWT_SECRET,
      validate,
      verifyOptions: { algorithms: ["HS256"] },
    });

    server.auth.default("jwt");
  },
};
