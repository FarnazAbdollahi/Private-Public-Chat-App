import { useState } from "react"

const MessagePanel = ({ user, onMessage }) => {

    const [content, setContent] = useState("")
    const displaySender = (index) => {
        return (
            index === 0 ||
            user.messages[index - 1].fromSelf !==
            user.messages[index].fromSelf
        );
    }
    return <div>
        <div className="header">
        <i className={user.connected ? "icon connected" : "icon"}></i>
            {user.username}
        </div>

        <ul className="messages">
            {
                user.messages.map((message, index) => {
                    return <li
                        className="message"
                    >
                        {
                            displaySender( index) ? <div className="sender">
                            <span>Sender: </span>    {message.fromSelf ? "(yourself)" : user.username}
                            </div> : null
                        }

                        {message.content}
                    </li>
                })
            }
        </ul>
        <form className="form">
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Your message..." className="input" />
            <button type="button" onClick={() => {
                setContent("")
                onMessage(content)
            }} className="send-button">Send</button>
        </form>
    </div>
}
export default MessagePanel