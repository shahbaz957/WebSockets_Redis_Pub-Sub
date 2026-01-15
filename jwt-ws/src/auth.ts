import jwt from "jsonwebtoken";
import { IncomingMessage } from "http";
import type { WSUser } from "./types.js";

export function authenticateWS(req: IncomingMessage): WSUser {
  const url = new URL(req.url || "", `http://${req.headers.host}`); // req.url in WS only send the url other than headers.host
  const token = url.searchParams.get("token");
  if (!token) {
    throw new Error("Token not Found");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as WSUser;
  return decoded;
}
