import UserDAO from "../dao/mongoDB/users.ts";
import { STATUSES } from "../types/enums.js";
import { Middleware, UserWithId } from "../types/types.js";
import responses from "../utils/responses.ts";
import { __dirname } from "../utils/utils.ts";
import fs from "node:fs";

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

  static updatePhoto: Middleware = async (req, res, next) => {
    const user = req.user as UserWithId;
    const newFile = req.file?.filename;
    if (!newFile) return responses.errorResponse(res, "No file uploaded");
    if (user.photo) {
      const oldPath = __dirname + "/src/public" + user.photo;
      console.log(user.photo);
      fs.unlink(oldPath, (err) => {
        if (err && err.code !== "ENOENT") console.log("Error deleting old avatar: ", err);
      });
    }
    const url = "/profile/uploads/" + newFile;
    const { status } = await UserDAO.updatePhoto(user._id, url);
    if (status === STATUSES.SUCCESS) {
      responses.successResponse(res, { url });
    }
  };
}
