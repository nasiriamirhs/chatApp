import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import router from "./routes.js";
import cookieParser from "cookie-parser";
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(router);
const expressPort = process.env.PORT || 3000;
server.listen(expressPort, () => console.log(`server is running on port ${expressPort}`));
//# sourceMappingURL=index.js.map