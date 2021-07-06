import React, { useEffect, useState } from "react"
const ChatPanel = ({ messages, selectedRoom, onPublicMessage }) => {
    const [content, setContent] = useState("")
    return < div >
        <header>
            <h1>{selectedRoom}</h1>
        </header>
        <ul className="messages">
           
            {messages ?
                messages.filter((item) => {
                    return item.room === selectedRoom
                }).map((message, index) => {
                    return <li
                    key={index}
                        className="message"
                    > <div className="sender">
                            <span>Sender: </span> {message.user}
                        </div>
                        {message.message}
                    </li>
                }) : null
            }
        </ul>
        <form className="form">
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Your message..." className="input" />
            <button type="button" onClick={() => {
                setContent("")
                onPublicMessage(selectedRoom, content)
            }} className="send-button">Send</button>
        </form>
    </div >
}
export default ChatPanel