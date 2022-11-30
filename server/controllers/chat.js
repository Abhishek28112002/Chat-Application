import mongoose from "mongoose";
import privateMessageSchema from "../models/pmessage";
import groupeMessageSchema from "../models/gmessage";
// import gmessage from "../models/gmessage";
// import user from "../models/users";

let allConnections = [];
let allgroup=[];
const chat = (io) => {
  io.on("connection", (socket) => {
    console.log(
      "Client connected with id: ",
      socket.id,
      " and username: ",
      socket.handshake.auth.sender,
      " and groupname: ",
      socket.handshake.auth.newgroup
    );
    socket.join(socket.handshake.auth.newgroup);
    allConnections.push({
      username: socket.handshake.auth.sender,
      socketid: socket.id,
      room:socket.handshake.auth.newgroup,
    });
    
    socket.on("newGmessaget_s",(data)=>{
      console.log(data);
      socket.broadcast.to(data.newgroup).emit("notify_message",{message:`${data.sender}`+" joined",receiver:data.newgroup,sent:data.sent,sender:data.sender})
     
    })
    //Private Message to server event
    socket.on("pmessaget_s", (data) => {
      console.log(data);
      let arr = [data.sender, data.receiver];
      arr.sort();
      console.log(arr);
      const model = mongoose.model(
        `${arr[0]}__${arr[1]}`,
        privateMessageSchema
      );
      console.log(model);
      const doc = new model(data);
      console.log(doc);
      doc.save((err) => {
        if (err)
          console.log("Error encountered while adding message to db, ", err);
      });

      // Giving confirmation to sender about message being received
      socket.emit("receive", data);
      const searchindex = allConnections.findIndex(
        (usr) => usr.username === data.receiver
      );
      io.to(allConnections[searchindex].socketid).emit("receive",data);
    });
    socket.on("Gmessaget_s", (data) => {
      io.to(data.newgroup).emit("group",{receiver:data.newgroup,sent:data.sent,sender:data.sender,message:data.groupMessage});
    });

  

    socket.on("disconnect", () => {
      const searchindex = allConnections.findIndex(
        (usr) => usr.socketid === socket.id
      );
      const sender=allConnections[searchindex].username;
      const groupname=allConnections[searchindex].room;
      const sent=new Date();
      io.to(groupname).emit("notify_message",{message:`${sender}`+" left",receiver:`${groupname}`,sent:`${sent}`,sender:`${sender}`})
      allConnections.splice(searchindex, 1);
     
    });
  });
};

export default chat;
