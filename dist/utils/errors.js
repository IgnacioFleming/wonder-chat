export const ERRORS = {
    UNHANDLED: "unhandled_error",
    UNKNOWN: "unknown_error",
};
export default class CustomError extends Error {
    name;
    constructor(name, message) {
        super(message);
        this.name = name;
    }
}
