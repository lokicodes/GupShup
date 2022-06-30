const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require("./router");
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const {addUser, removeUser , getUser , getUsersInRoom}  = require('./user');


const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(router);
app.use(cors());
io.on("connection", (socket) => {

    socket.on('join' , ({name, room} , callback)=>{
       const {error , user} = addUser({id : socket.id , name, room});

       if (error){
        return callback(error);
    } 
       socket.join(user.room);
    //    console.log("user has joined");
       socket.emit('message' , {user : 'admin' , text: `Hi ! ${user.name.toUpperCase()} , swagat hai aapka GUPSHUP me , apne room "${user.room.toUpperCase()}" me maze karein 🎉`});
       socket.broadcast.to(user.room).emit('message' , {user : 'admin' , text: `${user.name.toUpperCase()} hamare sath jud chuke hain. Taaliyan ho Jaye!`});

       io.to(user.room).emit('roomData' , { room : user.room , users : getUsersInRoom(user.room)});

       callback();
});

    socket.on('sendMessage' , (message , callback) =>{
        const user = getUser(socket.id);

        io.to(user.room).emit('message' , { user : user.name , text : message});

        callback(); 
    });

    socket.on('disconnect', ()=>{
        // console.log("User got disconnected ;(");
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message' , {user : 'admin' , text : `${user.name.toUpperCase()} has left the chat`});
            io.to(user.room).emit('roomData' , { room : user.room , users : getUsersInRoom(user.room)});
        }

    });
});

server.listen(PORT , () => console.log(`Server started on port ${PORT}`));