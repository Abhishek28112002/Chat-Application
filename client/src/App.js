import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import Msgbox from "./components/msgbox";
import "./App.css";
const URL = "http://localhost:8000";

const socket = io(URL, {
  path: "/socket.io",
  autoConnect: false,
  reconnection: false,
});

function App() {
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [authtoken, setAuthToken] = useState("");
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [chats, setChats] = useState([]);
  const [personalchatFile, setpersonalchatFile] = useState();
  const [groupchatfile, setgroupchatFile] = useState();

  const [newgroup, setnewGroup] = useState("");
  const [groupMessage, setGroupMessage] = useState("");

  useEffect(() => {
    socket.on("tosender", (data) => {
      console.log(data, socket.id);
    });
    return () => {
      socket.off("test");
    };
  }, []);
  useEffect(() => {
    socket.on("notify_message", (data) => {
      setChats((prev) => [...prev, data]);
    });
    return () => {
      socket.off("notify_message");
    };
  }, []);

  useEffect(() => {
    socket.on("receive", (data) => {
      console.log(data);
      setChats((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive");
    };
  }, []);

  useEffect(() => {
    socket.on("group", (data) => {
      console.log(data);
      setChats((prev) => [...prev, data]);
    });

    return () => {
      socket.off("group");
    };
  }, []);

  const handleSender = (e) => {
    e.preventDefault();
    socket.auth = { sender, newgroup };
    socket.connect();
    setTimeout(() => {
      if (socket.connected) {
        console.log("socket.connected", socket);
        setConnected(true);
      }
    }, 300);
    const sent = new Date();
    socket.emit("newGmessaget_s", {
      sender,
      newgroup,
      authtoken,
      sent,
    });
  };

  const handlePrivateMessages = (e) => {
    e.preventDefault();
    const sent = new Date();
    socket.emit("pmessaget_s", {
      message,
      sender,
      receiver,
      authtoken,
      sent,
    });
  };
  const handleGroupMessages = (e) => {
    e.preventDefault();
    const sent = new Date();
   
    if(groupchatfile)
    {
      console.log(groupchatfile);
      setGroupMessage(groupchatfile.name);
      console.log(groupMessage)
    }
    socket.emit("Gmessaget_s", {
      groupMessage,
      sender,
      newgroup,
      authtoken,
      sent,
    });
  };

  const boxstyle = {
    selfAlign: "center",
    padding: "5px",
    margin: "10px auto",
    maxWidth: "400px",
  };

  return (
    <div className="App">
      <h3 style={{ textAlign: "center" }}>Chat API Testing</h3>
      {connected ? (
        <div>
          <h4 style={{ marginLeft: "70px" }}>Your Username: {sender} </h4>
          <h4 style={{ marginLeft: "70px" }}>Group: {newgroup} </h4>
          <form onSubmit={handlePrivateMessages} action="submit">
            <div className="row" style={{ display: "flex" }}>
              <input
                type="text"
                value={receiver}
                placeholder="Enter Receiver's username"
                onChange={(e) => setReceiver(e.target.value)}
                style={boxstyle}
              />
              <input
                type="file"
                id="siofu_input"
                onChange={(e) => setpersonalchatFile(e.target.files[0])}
                style={boxstyle}
              />
              <input
                type="text"
                value={message}
                placeholder="Enter the message"
                onChange={(e) => setMessage(e.target.value)}
                style={boxstyle}
              />

              <button
                className="btn btn-primary"
                type="submit"
                style={{ maxWidth: "10%", margin: "10px auto" }}
              >
                Send
              </button>
            </div>
          </form>
          <div>
            <form onSubmit={handleGroupMessages} action="submit">
              <div className="row">
                <input
                  type="text"
                  value={groupMessage}
                  placeholder="Enter the message that you want to send in group"
                  onChange={(e) => setGroupMessage(e.target.value)}
                  style={boxstyle}
                />

                <input
                  type="file"
                  id="siofu_input"
                  onChange={(e) => setgroupchatFile(e.target.files[0])}
                  style={boxstyle}
                />
                <button
                  className="btn btn-primary"
                  type="submit"
                  style={{ maxWidth: "10%", margin: "10px auto" }}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
          <div>
            {chats.map((msg) => {
              return (
                <Msgbox
                  msg={msg}
                  sentbyme={msg.sender === sender}
                  key={Math.random()}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="login">
          <div className="form">
            <form className="login-form" action="submit" onSubmit={handleSender}>
              <input
                type="text"
                placeholder="Enter Your(sender's) username"
                onChange={(e) => setSender(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter Group Name"
                onChange={(e) => setnewGroup(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter Sender's auth token(passed as cookie)"
                onChange={(e) => setAuthToken(e.target.value)}
                required
              />
              <button type="submit">login</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
