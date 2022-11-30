import React from "react";
import './msgbox.css';
const Msgbox = (props) => {

  return (
    <div>
       <div className="container">
      {props.sentbyme ? (
       
        <div className="message-blue">
          <p className="sender">{props.msg.sender}</p>
            <p className="message-content">{props.msg.message}</p>
            <div className="message-timestamp-left">{new Date(props.msg.sent).getHours()}:{new Date(props.msg.sent).getMinutes()}</div>
        </div>
       
      ) : (
        <div className="message-orange">
           <p className="sender">{props.msg.sender}</p>
       <p className="message-content">{props.msg.message}</p>
            <div className="message-timestamp-left">{new Date(props.msg.sent).getHours()}:{new Date(props.msg.sent).getMinutes()}</div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Msgbox;
