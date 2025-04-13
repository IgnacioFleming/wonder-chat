import { userModel } from "../models/users.js";
export default class UserDAO {
    static async getAll() {
        try {
            const users = await userModel.find().lean();
            return { status: "success" /* STATUSES.SUCCESS */, payload: users };
        }
        catch (error) {
            throw error;
        }
    }
    static async getContacts(id) {
        try {
            const contacts = await userModel.find({ _id: { $ne: id } }).lean();
            return { status: "success" /* STATUSES.SUCCESS */, payload: contacts };
        }
        catch (error) {
            throw error;
        }
    }
    static async getbyId(id) {
        try {
            const user = await userModel.findById(id).lean();
            if (!user?.username)
                return { status: "error" /* STATUSES.ERROR */, error: "User not found." };
            return { status: "success" /* STATUSES.SUCCESS */, payload: user };
        }
        catch (error) {
            throw error;
        }
    }
    static async create(body) {
        try {
            const result = await userModel.create(body);
            if (!result?._id)
                return { status: "error" /* STATUSES.ERROR */, error: "User not found." };
            return { status: "success" /* STATUSES.SUCCESS */, payload: body };
        }
        catch (error) {
            throw error;
        }
    }
}
