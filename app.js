const express = require('express');

const socket = require('socket.io');

const app = express();


app.use(express.static("public"));
let port = 3000;
let server = app.listen(port , ()=>{
    console.log("Listening to port " + port)
})

let io = socket(server);

io.on("connection" , (socket)=>{
    console.log("made a connection");

    socket.on("beginPath" , (data) =>{
        io.sockets.emit("beginPath" , data);
    })

    socket.on("drawstroke" , (data)=>{
        io.sockets.emit("drawstroke" , data);
    })
    socket.on("undoredocanvas", (data) => {
        io.sockets.emit("undoredocanvas", data);
    })
})