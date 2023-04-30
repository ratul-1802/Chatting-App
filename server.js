//creating server
const express=require('express');
const { userInfo } = require('os');
const app=express();

const http=require('http').createServer(app);
const PORT=process.env.PORT|3000;
http.listen(PORT,()=>{
    //console.log(`server running at ${PORT}`);
});  

app.get("/",(req,resp)=>{
    resp.sendFile(__dirname+"/index.html")
});
 
app.use(express.static(__dirname));//helps in rendering css included in html

//socket

const io=require("socket.io")(http);

io.on('connection',(socket)=>{
    console.log(`user${socket.id}connected`);
    socket.on('message',(user_info)=>{
        socket.to(user_info.user_id).emit('message',user_info);
    }) 
    socket.on('joinroom',(id)=>{
        socket.join(id);
    })
    socket.on('disconnect',()=>{
        console.log(`user${socket.id}disconnected`);
    })
})