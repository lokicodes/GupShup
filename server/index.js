const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require("./router");
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);
io.on("connection", (socket) => {
    console.log("User is connected !!");
    socket.on('join' , ({name, room})=>{
        console.log(name, room);
    })
    socket.on("disconnect", ()=>{
        console.log("User got disconnected ;(");
    });
});
app.use(router);

server.listen(PORT , () => console.log(`Server started on port ${PORT}`));