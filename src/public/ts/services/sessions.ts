import { PersistResult } from "../../../types/DAO.js";
import { STATUSES } from "../../../types/enums.js";
import { AuthUser, UserWithId } from "../../../types/types.js";
import { errorAlert, registerAlert } from "../alerts/alerts.ts";
import { setUser } from "../store/storeHandlers.ts";

export const logout = () => {
  fetch("/api/sessions/logout", {
    method: "POST",
  })
    .then((res) => res.json())
    .then(({ status }) => status === STATUSES.SUCCESS && (window.location.href = "/demo-login"))
    .catch((err) => console.log(err));
};

export const authenticate = (userEntries: AuthUser) => {
  const path = location.pathname;
  if (!userEntries.password) userEntries.password = "123";
  const successMessage = location.pathname === "/register" ? "User registered successfully, please click bellow to go to Login" : "User logged successfully";
  const errorMessage = location.pathname === "/demo-login" ? "This name is already taken, please try another" : location.pathname === "/register" ? "Error during registration, please try again" : "Login failed, please try again";
  fetch(`/api/sessions${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userEntries),
  })
    .then((res) => {
      if (location.pathname === "/login" && !res.ok) {
        return errorAlert("Invalid credentials");
      }
      return res.json();
    })
    .then((json: PersistResult<Omit<UserWithId, "password">>) => {
      if (!json) return;
      if (location.pathname === "/register") {
        if (json.status === STATUSES.SUCCESS) {
          return registerAlert(successMessage);
        }
        return errorAlert(errorMessage);
      }

      if (json.status !== STATUSES.SUCCESS) return alert(errorAlert);
      setUser(json.payload);
      return (location.href = "/");
    })
    .catch((err) => console.log(err));
};
