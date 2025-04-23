import { STATUSES } from "../../../types/enums.js";
import { updateUser } from "../helpers/storeHandlers.ts";

export const updateUserPhoto = async (body: FormData): Promise<string | null> => {
  const result = await fetch(`api/users/updateProfilePhoto`, {
    method: "PUT",
    body,
  });
  const { status, payload } = await result.json();

  if (status === STATUSES.SUCCESS) {
    updateUser({ photo: payload.url });
    return payload.url;
  }
  return null;
};
