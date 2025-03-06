import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __pathname = fileURLToPath(import.meta.url);

export const __dirname = dirname(dirname(dirname(__pathname)));
