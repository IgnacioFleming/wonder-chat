import { STATUSES } from "../types/enums.js";
import { Response } from "../types/types.js";

const successResponse: Response = (res, payload) => {
  res.json({ status: STATUSES.SUCCESS, payload });
};

const errorResponse: Response = (res, error) => {
  res.json({ status: STATUSES.ERROR, error });
};

export default { successResponse, errorResponse };
