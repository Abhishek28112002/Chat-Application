// Main chat server runner

import chat from "./controllers/chat.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

const app = express();
var siofu = require("socketio-file-upload");
app.use(siofu.router)
const http = require("http").createServer(app);
const Url="mongodb+srv://abhi2811:abhi28112002%40@cluster0.5hpksjv.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(Url, (err) => {
  if (err) {
    console.log("Database connection error: ", err);
  } else {
    console.log("Chat API Connected to database");
    mongoose.pluralize(null);
  }
});
const io = require("socket.io")(http, {
  path: "/socket.io",
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["content-type"],
  },
});

//Middlewares
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

//api main
app.get("/api", (req, res) => {
  res.send("API implementation goes here");
});

// socket implementation
chat(io);

const port = 8000;
http.listen(port, () => {
  console.log("Chat server running on port ", port);
});
