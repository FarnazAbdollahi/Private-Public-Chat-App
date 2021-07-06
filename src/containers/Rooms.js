const Rooms = ({ room, setSelectedRoom }) => {
  return <div className={`user `} onClick={()=>setSelectedRoom(room)}>
    <div className="description">
      <div className="name">
        {room}
      </div>

    </div>

  </div>
}
export default Rooms