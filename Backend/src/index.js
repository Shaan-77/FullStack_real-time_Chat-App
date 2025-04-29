import express from "express";
import dotenv from "dotenv";
import authRoutes from "./Routes/auth.route.js";
import { connectDB } from "../src/lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./Routes/message.route.js";
import cors from "cors";
import { initSocket } from "./lib/socket.js";
import http from "http";
import path from "path";

dotenv.config(".env");
const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);
initSocket(server); // ab socket server properly init hoga

const __dirname = path.resolve();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server started on port :", PORT);
  connectDB();
});
