import { io } from "socket.io-client";

const URL = "http://localhost:3000";

// The Socket.IO client is initialized here
// autoConnect is set to false so the connection is not established right away.
// We will manually call socket.connect() later, once the user has selected a username.
const socket = io(URL, { autoConnect: false });


//onAny is used to so that any event received by the client will be printed in the console.
socket.onAny((event, ...args) => {
  // console.log(event, args);
});

export default socket;
