import UserDAO from "../dao/mongoDB/users.js";
import responses from "../utils/responses.js";
import { STATUS_TYPES } from "../utils/status.js";
export default class UserController {
    static getAll = async (req, res, next) => {
        try {
            const { payload } = await UserDAO.getAll();
            responses.successResponse(res, payload);
        }
        catch (error) {
            next(error);
        }
    };
    static getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status, payload, error } = await UserDAO.getbyId(id);
            if (status === STATUS_TYPES.NOT_FOUND)
                return responses.notFoundResponse(res, { error });
            responses.successResponse(res, payload);
        }
        catch (error) {
            next(error);
        }
    };
    static create = async (req, res, next) => {
        try {
            const { body } = req;
            const { status, payload, error } = await UserDAO.create(body);
            if (status === STATUS_TYPES.NOT_FOUND)
                return responses.notFoundResponse(res, { error });
            responses.successResponse(res, payload);
        }
        catch (error) {
            next(error);
        }
    };
}
