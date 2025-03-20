import { User, UserWithId } from "../../types/types.js";

export default class UserDTO implements User {
  full_name: string;
  password: string;
  is_online?: boolean | undefined;
  last_connection?: DateConstructor | undefined;
  photo?: string | undefined;
  signup_date?: DateConstructor | undefined;

  constructor(user: UserWithId) {
    this.full_name = user.full_name;
    this.password = user.password;
    this.is_online = user.is_online;
    this.last_connection = user.last_connection;
    this.photo = user.photo;
    this.signup_date = user.signup_date;
  }
}
