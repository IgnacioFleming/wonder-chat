import { PersistResult } from "../../types/DAO.js";
import { STATUSES } from "../../types/enums.js";
import type { GeneralId, User, UserWithId } from "../../types/types.d.ts";
import { userModel } from "../models/users.ts";

export default class UserDAO {
  static async getAll(): Promise<PersistResult<UserWithId[]>> {
    try {
      const users = await userModel.find().lean<UserWithId[]>();
      return { status: STATUSES.SUCCESS, payload: users };
    } catch (error) {
      throw error;
    }
  }
  static async getContacts(id: string): Promise<PersistResult<UserWithId[]>> {
    try {
      const contacts = await userModel
        .find({ _id: { $ne: id } })
        .sort({ full_name: 1 })
        .lean<UserWithId[]>();
      return { status: STATUSES.SUCCESS, payload: contacts };
    } catch (error) {
      throw error;
    }
  }
  static async getbyId(id: string): Promise<PersistResult<UserWithId>> {
    try {
      const user = await userModel.findById(id).lean<UserWithId>();
      if (!user?.full_name) return { status: STATUSES.ERROR, error: "User not found." };
      return { status: STATUSES.SUCCESS, payload: user };
    } catch (error) {
      throw error;
    }
  }
  static async getbyFullName(name: string): Promise<PersistResult<UserWithId>> {
    try {
      const user = await userModel.findOne({ full_name: name }).lean<UserWithId>();
      if (!user?.full_name) return { status: STATUSES.ERROR, error: "User not found." };
      return { status: STATUSES.SUCCESS, payload: user };
    } catch (error) {
      throw error;
    }
  }
  static async create(body: User): Promise<PersistResult<User>> {
    try {
      const result = await userModel.create(body);
      if (!result?._id) return { status: STATUSES.ERROR, error: "User not found." };
      return { status: STATUSES.SUCCESS, payload: body };
    } catch (error) {
      throw error;
    }
  }
  static async updateLastConnection(id: string, changeStatus: "online" | "offline") {
    try {
      const last_connection = new Date();
      const query = changeStatus === "online" ? { is_online: true } : { is_online: false, last_connection };
      await userModel.findByIdAndUpdate(id, { $set: query });
      return { status: STATUSES.SUCCESS, payload: { userId: id, is_online: query.is_online, last_connection: query.last_connection } };
    } catch (error) {
      throw error;
    }
  }
}
