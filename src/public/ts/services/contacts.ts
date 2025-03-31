import { PersistResult } from "../../../types/DAO.js";
import { ObjectId, UserWithId } from "../../../types/types.js";
import { STATUSES } from "../../../types/enums.js";

export const getContacts = async (id: ObjectId) => {
  const result = await fetch(`/api/contacts/${id}`);
  const json: PersistResult<UserWithId[]> = await result.json();
  if (json.status !== STATUSES.SUCCESS) return;
  return json.payload;
};
