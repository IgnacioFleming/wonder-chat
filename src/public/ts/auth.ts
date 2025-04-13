import { PersistResult } from "../../types/DAO.js";
import { STATUSES } from "../../types/enums.js";
import { AuthUser, UserWithId } from "../../types/types.js";
import helpers from "./helpers.ts";

const path = location.pathname;
const successAlert = location.pathname === "/register" ? "Usuario registrado ok" : "Usuario logueado correctamente";
const errorAlert = location.pathname === "/register" ? "Fallo el registro del user" : "Fallo el login, reintente";

const form = document.querySelector(".authForm") as HTMLFormElement;
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const userEntries = Object.fromEntries(formData) as AuthUser;
  fetch(`/api/sessions${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userEntries),
  })
    .then((res) => res.json())
    .then((json: PersistResult<Omit<UserWithId, "password">>) => {
      if (location.pathname === "/register") {
        if (json.status === STATUSES.SUCCESS) {
          alert(successAlert);
          return (location.href = "/login");
        }
        return alert(errorAlert);
      }
      if (location.pathname === "/login") {
        if (json.status !== STATUSES.SUCCESS) return alert(errorAlert);
        helpers.setUser(json.payload);
        return (location.href = "/");
      }
    });
});
