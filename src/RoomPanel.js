import ChatPanel from "./containers/ChatPanel";
import Rooms from "./containers/Rooms"

const RoomPanel = ({ rooms, selectedRoom, setSelectedRoom, onPublicMessage, messages}) => {
    return <div>
        <div className="left-room-panel">
            {rooms.map((room, index) => {
                return (
                    <Rooms
                        key={index}
                        room={room}
                        setSelectedRoom={setSelectedRoom}
                    />
                );
            })
            }
        </div>
        {
            selectedRoom ? <div className="right-room-panel">
                <ChatPanel messages={messages} onPublicMessage={onPublicMessage} selectedRoom={selectedRoom} />
            </div> : null
        }

    </div>
}
export default RoomPanel

