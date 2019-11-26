const socket = require("socket.io");
const express = require("express");

const app = express();

const server = app.listen(3001, () => console.log("Listining to port 3001"));

app.get("/", (req, res) => {
  res.send("Server is Running");
});

const io = socket(server);

const users = [];

io.on("connection", socket => {
  io.emit("AVILABLE_USERS", users);
  console.log(`${socket.id} connected`);
  socket.on("SET_USER", user => {
    users.push({ [socket.id]: user });
    io.emit("AVILABLE_USERS", users);
  });
  socket.on("chat", data => {
    socket.broadcast.emit("MESSAGE_RECIEVED", data);
  });
  socket.on("typing", data => {
    socket.broadcast.emit("typing", data);
  });
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    let index = -1;
    for (let i = 0; i < users.length; i++) {
      if (Object.keys(users[i])[0] === socket.id) {
        index = i;
        break;
      }
    }
    users.splice(index, 1);
  });
});
