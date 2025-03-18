import type { User } from "../../types/types.d.ts";
import { STATUS_TYPES } from "../../utils/status.ts";
import { userModel } from "../models/users.ts";

export default class UserDAO {
  static async getAll() {
    try {
      const users = await userModel.find();
      return { status: STATUS_TYPES.SUCCESS, payload: users };
    } catch (error) {
      throw error;
    }
  }
  static async getContacts(id: string) {
    try {
      const contacts = await userModel.find({ _id: { $ne: id } }).lean();
      return { status: STATUS_TYPES.SUCCESS, payload: contacts };
    } catch (error) {
      throw error;
    }
  }
  static async getbyId(id: string) {
    try {
      const user = await userModel.findById(id);
      if (!user?.id) return { status: STATUS_TYPES.NOT_FOUND, error: "User not found." };
      return { status: STATUS_TYPES.SUCCESS, payload: user };
    } catch (error) {
      throw error;
    }
  }
  static async create(body: User) {
    try {
      const user = await userModel.create(body);
      if (!user?.id) return { status: STATUS_TYPES.NOT_FOUND, error: "User not found." };
      return { status: STATUS_TYPES.SUCCESS, payload: user };
    } catch (error) {
      throw error;
    }
  }
}
