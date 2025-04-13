import UserDTO from "../dao/dto/usersDTO.ts";
import { Middleware, UserWithId } from "../types/types.js";
import responses from "../utils/responses.ts";

export default class SessionsController {
  static register: Middleware = async (req, res, next) => {
    responses.successResponse(res, "User registered");
  };

  static login: Middleware = async (req, res, next) => {
    const user = new UserDTO(req.user as UserWithId);
    responses.successResponse(res, user);
  };
}
