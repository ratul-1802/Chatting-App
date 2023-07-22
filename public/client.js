const socket=io();
const room_join=document.querySelector('#room-join');
const user_name=document.querySelector('#user-name');
const room_id=document.querySelector('#room-id');
const send=document.querySelector('.send');
// do {
//     name=prompt("plz enter your name to start the conversation");
// } while (!name);
let name,id;
let txt=document.querySelector("#textarea");
let room=document.querySelector("#room");
let message_area=document.querySelector(".message_area");
let message_section=document.querySelector(".message_section");
let joining_details=document.querySelector('.container');
room_join.addEventListener('click',(e)=>{
    name=user_name.value;
    id=room_id.value;
    if(name!=='' && id!==''){
        joining_details.classList.toggle('hide');
        message_section.classList.toggle('hide');
        socket.emit('joinroom',id);
        room.innerHTML=`Room No: ${id}`;
    }
})
// txt.addEventListener("keyup",(e)=>{
//     if(e.key==="Enter" && e.target.value!==''&& e.target.value!=='\n'){
//         console.log(e.target.value);
//         send_msg(e.target.value);
//     }
// })
send.addEventListener("click",(e)=>{
    if(txt.value!=='')
    send_msg(txt.value); 
})

function send_msg(msg){
    let user_info={
        user:name,
        user_id:id,
        message:msg.trim()
    }
    //append message
    append_msg(user_info,'outgoing');
    txt.value='';
    message_area.scrollTop=message_area.scrollHeight;

    //sending to server
    socket.emit('message',user_info);

}

function getTime(){
    let date=new Date();
    let h=date.getHours();
    let m=date.getMinutes();
    let s=date.getSeconds();
    let ampm="AM";
    if(h>=12){
        h=h-12;
        ampm="PM";
    }
    //h = h == 0 ? h = 12 : h;
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    time=`${h}:${m} ${ampm}`;
    return time;
}

function append_msg(user_info,type){
    let addDiv=document.createElement('div');
    let clsName=type;
    addDiv.classList.add(clsName,'message');
    //time calculation
    let time=getTime();
    let msg_content=`
    <h1>${user_info.user}</h1>
    <p>${user_info.message}</p>
    <p id="time">${time}</p>
    `
    addDiv.innerHTML=msg_content;
    message_area.appendChild(addDiv);
}

//receive message

socket.on('message',(user_info)=>{
    append_msg(user_info,'incoming');
    message_area.scrollTop=message_area.scrollHeight;
});