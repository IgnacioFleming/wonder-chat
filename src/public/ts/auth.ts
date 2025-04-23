import { AuthUser } from "../../types/types.js";
import { authenticate } from "./services/sessions.ts";

const form = document.querySelector(".authForm") as HTMLFormElement;
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const userEntries = Object.fromEntries(formData) as AuthUser;
  authenticate(userEntries);
});
