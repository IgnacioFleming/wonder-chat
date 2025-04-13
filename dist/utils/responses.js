const successResponse = (res, payload) => {
    res.json({ status: "success" /* STATUSES.SUCCESS */, payload });
};
const errorResponse = (res, error) => {
    res.json({ status: "error" /* STATUSES.ERROR */, error });
};
export default { successResponse, errorResponse };
