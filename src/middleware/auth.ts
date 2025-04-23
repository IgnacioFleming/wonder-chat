import { Middleware } from "../types/types.js";
import responses from "../utils/responses.ts";

export const auth: Middleware = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  console.log("entro en auth");
  return responses.unauthorizedResponse(res);
};
