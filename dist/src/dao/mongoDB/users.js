import { STATUS_TYPES } from "../../utils/status.js";
import { userModel } from "../models/users.js";
export default class UserDAO {
    static async getAll() {
        try {
            const users = await userModel.find();
            if (!users)
                return { status: STATUS_TYPES.NOT_FOUND, error: "User not found." };
            return { status: STATUS_TYPES.SUCCESS, payload: users };
        }
        catch (error) {
            throw error;
        }
    }
    static async getbyId(id) {
        try {
            const user = await userModel.findById(id);
            if (!user?.id)
                return { status: STATUS_TYPES.NOT_FOUND, error: "User not found." };
            return { status: STATUS_TYPES.SUCCESS, payload: user };
        }
        catch (error) {
            throw error;
        }
    }
    static async create(body) {
        try {
            const user = await userModel.create(body);
            if (!user?.id)
                return { status: STATUS_TYPES.NOT_FOUND, error: "User not found." };
            return { status: STATUS_TYPES.SUCCESS, payload: user };
        }
        catch (error) {
            throw error;
        }
    }
}
