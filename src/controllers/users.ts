import UserDAO from "../dao/mongoDB/users.ts";
import { STATUSES } from "../types/enums.js";
import { Middleware } from "../types/types.js";
import responses from "../utils/responses.ts";

export default class UserController {
  static getAll: Middleware = async (req, res, next) => {
    try {
      const { payload } = await UserDAO.getAll();
      responses.successResponse(res, payload);
    } catch (error: unknown) {
      next(error);
    }
  };
  static getById: Middleware = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, payload, error } = await UserDAO.getbyId(id);
      if (status === STATUSES.ERROR) return responses.errorResponse(res, { error });
      responses.successResponse(res, payload);
    } catch (error: unknown) {
      next(error);
    }
  };
  static create: Middleware = async (req, res, next) => {
    try {
      const { body } = req;
      const { status, payload, error } = await UserDAO.create(body);
      if (status === STATUSES.ERROR) return responses.errorResponse(res, { error });
      responses.successResponse(res, payload);
    } catch (error: unknown) {
      next(error);
    }
  };
}
