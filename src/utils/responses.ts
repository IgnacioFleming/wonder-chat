import { STATUSES } from "../types/enums.js";
import { Response } from "../types/types.js";

const successResponse: Response = (res, payload) => {
  res.json({ status: STATUSES.SUCCESS, payload });
};

const errorResponse: Response = (res, error) => {
  res.status(400).json({ status: STATUSES.ERROR, error });
};

const unauthorizedResponse: Response = (res) => {
  res.status(401).json({ status: STATUSES.ERROR, error: "Unauthorized" });
};

export default { successResponse, errorResponse, unauthorizedResponse };
