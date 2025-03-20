const successResponse = (res, payload) => {
    res.json({ status: "success" /* STATUSES.SUCCESS */, payload });
};
const errorResponse = (res, error) => {
    res.status(400).json({ status: "error" /* STATUSES.ERROR */, error });
};
const unauthorizedResponse = (res) => {
    res.status(401).json({ status: "error" /* STATUSES.ERROR */, error: "Unauthorized" });
};
export default { successResponse, errorResponse, unauthorizedResponse };
