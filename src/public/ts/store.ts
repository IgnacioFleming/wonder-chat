import { UserWithId } from "../../types/types.js";

type GlobalState = {
  user: Omit<UserWithId, "password"> | null;
  selectedContact: Omit<UserWithId, "password"> | null;
};

export const GlobalState: GlobalState = {
  user: JSON.parse(localStorage.getItem("user") || "") || null,
  selectedContact: JSON.parse(localStorage.getItem("contact") || "") || null,
};
