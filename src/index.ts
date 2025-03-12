import { server } from "./app.ts";

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log("Server ON"));
