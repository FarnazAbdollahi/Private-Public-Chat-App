const UserPanel = ({ user, onSelectUser, selected }) => {
  return <div className={`user ${selected ? "selected" : ""}`}  onClick={() => onSelectUser(user)}>
    <div className="description">
      <div className="name">
        {user.username}  {user.self ? " (yourself)" : ""}
      </div>
      <div className="status">
        <i className={user.connected ? "icon connected" : "icon"}></i>
        {user.connected ? "online" : "offline"}
      </div>
    </div>
    {
      user.hasNewMessages ? <div className="new-messages">!</div>
        : null
    }
  </div>
}
export default UserPanel