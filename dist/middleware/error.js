import CustomError, { ERRORS } from "../utils/errors.js";
import responses from "../utils/responses.js";
export const createCustomError = (err, req, res, next) => {
    if (err instanceof Error) {
        const error = new CustomError(err.name, err.message);
        return responses.errorResponse(res, { name: error.name, message: error.message });
    }
    const unhandledError = new CustomError(ERRORS.UNHANDLED, "An unhandled error has ocurred.");
    return responses.errorResponse(res, { name: unhandledError.name, message: unhandledError.message });
};
