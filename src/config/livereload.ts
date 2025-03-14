import { __dirname } from "../utils/utils.ts";
import type { Express } from "express";

export const reloadClient = async (app: Express) => {
  if (process.env.NODE_ENV !== "development") return;
  const livereload = await import("livereload");
  const connectLivereload = await import("connect-livereload");
  app.set("view cache", false);
  app.use(connectLivereload.default());

  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch([__dirname + "/dist/public", __dirname + "/dist/views"]);

  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
};
