import UserDAO from "../dao/mongoDB/users.ts";
import { Middleware } from "../types/types.js";
import responses from "../utils/responses.ts";
import { STATUS_TYPES } from "../utils/status.ts";

export default class UserController {
  static getAll: Middleware = async (req, res, next) => {
    try {
      const { status, payload, error } = await UserDAO.getAll();
      if (status === STATUS_TYPES.NOT_FOUND) return responses.notFoundResponse(res, { error });
      responses.successResponse(res, payload);
    } catch (error: unknown) {
      next(error);
    }
  };
  static getById: Middleware = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, payload, error } = await UserDAO.getbyId(id);
      if (status === STATUS_TYPES.NOT_FOUND) return responses.notFoundResponse(res, { error });
      responses.successResponse(res, payload);
    } catch (error: unknown) {
      next(error);
    }
  };
  static create: Middleware = async (req, res, next) => {
    try {
      const { body } = req;
      const { status, payload, error } = await UserDAO.create(body);
      if (status === STATUS_TYPES.NOT_FOUND) return responses.notFoundResponse(res, { error });
      responses.successResponse(res, payload);
    } catch (error: unknown) {
      next(error);
    }
  };
}
