import React, { useEffect, useState } from "react"
import {socket} from "./socket";
import Chat from "./Chat"
const App = () => {
  const [userAlreadySelected, setUserAlreadySelected] = useState(false)
  const [username, setUsername] = useState("")

  const handleSubmit = () => {
    setUserAlreadySelected(true)
      socket.auth = { username };
      socket.connect();
  
  }

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      setUserAlreadySelected(true)
      socket.auth = { sessionID };
      socket.connect();
    }

    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUserAlreadySelected(false)
      }
    });
    
    return () => {
      socket.off("connect_error");
    }
  }, [])
  return (
      <div className="App">
        {
          userAlreadySelected ? <Chat /> :
            <div className="select-username">
              <input value={username} required placeholder="Your username..." onChange={(e) => setUsername(e.target.value)} />
              <button type="button" onClick={() => handleSubmit()} >Send</button>
            </div>
        }
      </div>
  );
}

export default App;
