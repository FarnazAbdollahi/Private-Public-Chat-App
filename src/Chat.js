import React, { useEffect, useState } from "react";
import MessagePanel from "./containers/MessagePanel";
import UserPanel from "./containers/UserPanel";
import RoomPanel from "./RoomPanel";
import socket from "./socket";

const Chat = () => {
  const [showRoom, setShowRoom] = useState(false)
  const [roomUsers, setRoomUsers] = useState([])
  const [messages, setMessages] = useState([])

  const [myUsers, setMyUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const rooms = ["movies"]

  const onMessage = (content) => {
    if (selectedUser) {
      socket.emit("private message", {
        content,
        to: selectedUser.userID,
      });
      var temp = selectedUser
      temp.messages.push({
        content,
        fromSelf: true,
      });
      setSelectedUser(temp);
    }
  };

  const onSelectUser = (user) => {
    setShowRoom(false)
    setSelectedUser(user);
  };

  const onSelectRoom = () => {
    setShowRoom(true)
    setSelectedUser("");

  };


  const setSelectedRoomHandler = (room) => {
    setSelectedRoom(room)
    socket.emit("create", room)

  }


  const onPublicMessage = (room, content) => {
    console.log(room, content)
    socket.emit('sendMessage', { room, content })
    var cu = myUsers.find((item) => {
      return item.self === true
    })
    console.log(cu)
    setMessages((p) => ([...p, { user: cu.username, room: room, message: content }]))
  }



  useEffect(() => {
    socket.on("connect", () => {
      var temp = myUsers
      temp.forEach((user, index) => {
        if (user.self) {
          user.connected = true
        }
      })
      setMyUsers(temp)
    });

    socket.on("disconnect", () => {
      var temp = myUsers
      temp.forEach((user, index) => {
        if (user.self) {
          user.connected = false;
        }
      });
    });

    const initReactiveProperties = (user) => {
      user.hasNewMessages = false;
    };
    //
    socket.on("users", (users) => {
      var temp = []
      users.forEach((user) => {
        user.messages.forEach((message) => {
          message.fromSelf = message.from === socket.userID;
        });
        for (let i = 0; i < temp.length; i++) {
          const existingUser = temp[i];
          if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected;
            existingUser.messages = user.messages;
            return;
          }
        }
        user.self = user.userID === socket.userID;
        initReactiveProperties(user);
        temp.push(user);
      });
      // put the current user first, and sort by username
      setMyUsers(() => {
        return temp.sort((a, b) => {
          if (a.self) return -1;
          if (b.self) return 1;
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        })
      })
    });

    socket.on("user connected", (user) => {
      for (let i = 0; i < myUsers.length; i++) {
        const existingUser = myUsers[i];
        if (existingUser.userID === user.userID) {
          existingUser.connected = true;
          return;
        }
      }
      initReactiveProperties(user);
      setMyUsers((prevState) => ([
        ...prevState,
        user
      ]))
    });

    socket.on("user disconnected", (id) => {
      for (let i = 0; i < myUsers.length; i++) {
        const user = myUsers[i];
        if (user.userID === id) {
          user.connected = false;
          break;
        }
      }
    });

    socket.on("sendMessage", message => {
      console.log("!", message)
      setMessages((prevState) => ([...prevState, message]))
    });

    socket.on("private message", ({ content, from }) => {
      var temp = myUsers

      for (let i = 0; i < temp.length; i++) {
        const user = temp[i];
        if (user.userID === from) {
          user.messages.push({
            content,
            fromSelf: false,
          });
          if (user !== selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
      setMyUsers(temp)
    });


    // socket.on("all messages", (messages) => {
    //   console.log("message socket", messages)
    //   setMessages(messages)
    // })





    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("users");
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("private message");
      socket.off("sendMessage");
    };
  }, [socket, selectedUser, myUsers]);

  console.log("messages", messages)

  return (
    <div>
      <div className="left-panel">
        <div className={`user `} onClick={() => onSelectRoom()}>
          <div className="description">
            <div className="name">
              Rooms
            </div>
          </div>
        </div>
        {myUsers.map((user, index) => {
          return (
            <UserPanel
              key={index}
              user={user}
              onSelectUser={onSelectUser}
              selected={selectedUser === user}
            />
          );
        })
        }
      </div>
      <div className="right-panel">
        {showRoom ? <RoomPanel
          rooms={rooms} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoomHandler} onPublicMessage={onPublicMessage}
          messages={messages}
        /> :
          selectedUser ? (
            <MessagePanel user={selectedUser} onMessage={onMessage} />
          ) : null}
      </div>
    </div>
  );
};
export default (Chat);
