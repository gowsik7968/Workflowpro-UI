import Notification from "../components/Notification"  
function Notifications() {
  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with your latest activities.</p>
        </div>
      </div>
      <div className="notifications-content">
        <Notification />
      </div>
    </div>
  )  
}

export default Notifications  