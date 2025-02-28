export const ERRORS = {
  UNHANDLED: "unhandled_error",
  UNKNOWN: "unknown_error",
} as const;

export default class CustomError extends Error {
  name: string;
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}
