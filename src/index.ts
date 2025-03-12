import { app } from "./app.ts";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log("Server ON"));
