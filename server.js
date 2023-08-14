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

let room_details=new Map();
//socket

const io=require("socket.io")(http);

io.on('connection',(socket)=>{
    console.log(`user${socket.id}connected`);
    console.log(socket.connected);
    // setInterval(check_disconnection,5000);
    // function check_disconnection(){
    //     room_details.forEach( async(value,key)=>{
    //         //console.log(key,value);
    //         const sockets = await io.in(key).fetchSockets();
    //         //let sock=nsp.sockets.get(key);
    //         console.log(sockets.connected);
    //         if(!sockets.connected){
    //             //console.log('working');
    //             //let user=room_details.get(key);
    //             socket.to(value.room_id).emit('left',value.name);
    //         }
    //     })
    // }
    socket.on('message',(user_info)=>{
        socket.to(user_info.user_id).emit('message',user_info);
    }) 
    socket.on('joinroom',(id,name)=>{
        let user_info={
            name:name,
            room_id:id
        };
        room_details.set(socket.id,user_info)
        socket.join(id);
        socket.to(id).emit('joined',name);
        socket.emit('joined','you');
    })
    socket.on('disconnecting',()=>{
        console.log(`user${socket.id}disconnected`);
        
    })
    socket.on('disconnect',()=>{
        socket.to(room_details.get(socket.id).room_id).emit('left',room_details.get(socket.id).name);
        console.log(`user${socket.id}disconnected`);
    })
})