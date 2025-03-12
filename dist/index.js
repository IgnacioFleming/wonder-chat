import { server } from "./app.js";
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("Server ON"));
