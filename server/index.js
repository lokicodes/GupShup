const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require("./router");
const PORT = process.env.PORT || 5000;
const {addUser, removeUser , getUser , getUsersInRoom}  = require('./user');
const { isArgumentsObject } = require('util/types');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
io.on("connection", (socket) => {

    socket.on('join' , ({name, room} , callback)=>{
       const {error , user} = addUser({id : socket.id , name, room});

       if (error){
        return callback(error);
    } 
    
       socket.join(user.room);
       socket.emit('message' , {user : 'admin' , text: `${user.name} , swagat hai aapka gapshap me , apne room ${user.room} me maze karein`});
       socket.broadcast.to(user.room).emit('message' , {user : 'admin' , text: `${user.name} hamare sath jud chuke hain. Taaliyan ho Jaye!`});
       
});

    socket.on('sendMessage' , (message , callback) =>{
        const user = getUser(socket.id);

        io.to(user.room).emit('message' , { user : user.name , text : message});

        callback(); 
    });

    socket.on("disconnect", ()=>{
        console.log("User got disconnected ;(");
    });
});
app.use(router);

server.listen(PORT , () => console.log(`Server started on port ${PORT}`));