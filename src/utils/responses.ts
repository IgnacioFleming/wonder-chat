import { Response } from "../types/types.js";
import { STATUS_TYPES } from "./status.ts";

const successResponse: Response = (res, payload) => {
  res.json({ status: STATUS_TYPES.SUCCESS, payload });
};

const notFoundResponse: Response = (res, error) => {
  res.json({ status: STATUS_TYPES.NOT_FOUND, error });
};

const errorResponse: Response = (res, error) => {
  res.json({ status: STATUS_TYPES.ERROR, error });
};

export default { successResponse, notFoundResponse, errorResponse };
