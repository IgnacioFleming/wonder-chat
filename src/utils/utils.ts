import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { Types } from "mongoose";

const __pathname = fileURLToPath(import.meta.url);

export const __dirname = dirname(dirname(dirname(__pathname)));

export const toObjectId = (input: string) => new Types.ObjectId(input);
