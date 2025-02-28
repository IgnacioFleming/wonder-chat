import type { User } from "../../types/types.d.ts";
import { STATUS_TYPES } from "../../utils/status.ts";
import { userModel } from "../models/users.ts";

export default class UserDAO {
  static async getbyId(id: string) {
    const user = await userModel.findById(id);
    if (!user) return { status: STATUS_TYPES.NOT_FOUND, error: "User not found." };
    return { status: STATUS_TYPES.SUCCESS, payload: user };
  }
  static async create(body: User) {
    const user = await userModel.create(body);
    if (!user.id) return { status: STATUS_TYPES.NOT_FOUND, error: "User not found." };
    return { status: STATUS_TYPES.SUCCESS, payload: user };
  }
}
