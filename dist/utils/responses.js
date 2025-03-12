import { STATUS_TYPES } from "./status.js";
const successResponse = (res, payload) => {
    res.json({ status: STATUS_TYPES.SUCCESS, payload });
};
const notFoundResponse = (res, error) => {
    res.json({ status: STATUS_TYPES.NOT_FOUND, error });
};
const errorResponse = (res, error) => {
    res.json({ status: STATUS_TYPES.ERROR, error });
};
export default { successResponse, notFoundResponse, errorResponse };
