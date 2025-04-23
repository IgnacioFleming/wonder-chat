import { PersistResult } from "../../../types/DAO.js";
import { STATUSES } from "../../../types/enums.js";
import { AuthUser, UserWithId } from "../../../types/types.js";
import { setUser } from "../helpers/storeHandlers.ts";

export const logout = () => {
  fetch("/api/sessions/logout", {
    method: "POST",
  })
    .then((res) => res.json())
    .then(({ status }) => status === STATUSES.SUCCESS && (window.location.href = "/login"))
    .catch((err) => console.log(err));
};

export const authenticate = (userEntries: AuthUser) => {
  const path = location.pathname;
  const successAlert = location.pathname === "/register" ? "Usuario registrado ok" : "Usuario logueado correctamente";
  const errorAlert = location.pathname === "/register" ? "Fallo el registro del user" : "Fallo el login, reintente";
  fetch(`/api/sessions${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userEntries),
  })
    .then((res) => {
      return res.json();
    })
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
        setUser(json.payload);
        return (location.href = "/");
      }
    })
    .catch((err) => console.log(err));
};
