import mongoose from "mongoose";
const userCollection = "users";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
    photo: {
        type: String,
        default: "",
    },
    signup_date: {
        type: String,
        default: Date(),
    },
    last_connection: {
        type: String,
        default: Date(),
    },
    is_online: Boolean,
});
export const userModel = mongoose.model(userCollection, userSchema);
