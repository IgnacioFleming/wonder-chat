import UserDAO from "../dao/mongoDB/users.ts";
import { Middleware, ObjectId } from "../types/types.js";
import responses from "../utils/responses.ts";

export default class ContactController {
  static getAll: Middleware = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { payload } = await UserDAO.getContacts(id);
      responses.successResponse(res, payload);
    } catch (error: unknown) {
      next(error);
    }
  };
}
