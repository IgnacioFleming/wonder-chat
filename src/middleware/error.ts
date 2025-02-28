import { ErrorMiddleware } from "../types/types.js";
import CustomError, { ERRORS } from "../utils/errors.ts";
import responses from "../utils/responses.ts";

export const createCustomError: ErrorMiddleware = (err, req, res) => {
  if (err instanceof Error) {
    const error = new CustomError(err.name, err.message);
    return responses.errorResponse(res, { error });
  }
  const unhandledError = new CustomError(ERRORS.UNHANDLED, "An unhandled error has ocurred.");
  return responses.errorResponse(res, { error: unhandledError });
};
