import { useEffect, useState } from "react" 
import { useNavigate } from "react-router-dom" 
import {getNotifications,getUnreadNotificationCount,markNotificationAsRead,
  markAllNotificationsAsRead,deleteNotification,} from "../services/api" 

function Notification() {
  const navigate = useNavigate() 
  const [notifications, setNotifications] = useState([]) 
  const [unreadCount, setUnreadCount] = useState(0) 
  const [loading, setLoading] = useState(true) 
  const [error, setError] = useState("") 
  // LOAD NOTIFICATIONS
  const loadNotifications = async () => {
    try {
      setLoading(true) 
      setError("") 
      const response = await getNotifications() 
      setNotifications(response.data) 
      const countResponse =
        await getUnreadNotificationCount() 
      setUnreadCount(countResponse.data) 
    } catch (error) {
      console.error("Failed to load notifications:",error)
      setError("Unable to load notifications. Please try again.") 
    } finally {
      setLoading(false) 
    }
  } 
  // LOAD WHEN PAGE OPENS
  useEffect(() => {
    loadNotifications() 
  }, []) 
  // OPEN NOTIFICATION
  const handleNotificationClick = async (
    notification) => {
    try {
      // Mark as read if unread
      if (!notification.readStatus) {
        await markNotificationAsRead(
          notification.id
        ) 
        setNotifications((previousNotifications) =>
          previousNotifications.map((item) =>
              item.id === notification.id
                ? {...item,readStatus: true,}: item)) 
        setUnreadCount((previousCount) =>
          previousCount > 0 ? previousCount - 1 : 0) 
      }
      // Open related task
      if (notification.taskId) {
        navigate(`/tasks/${notification.taskId}`) 
      }
    } catch (error) {
      console.error("Failed to open notification:",error) }
  }  
  // MARK ONE AS READ
  const handleMarkAsRead = async (
    notificationId) => {
    try {
      await markNotificationAsRead(notificationId) 
      setNotifications((previousNotifications) =>
        previousNotifications.map(
          (notification) => notification.id === notificationId
            ? {...notification, readStatus: true,}: notification)) 
      setUnreadCount((previousCount) =>previousCount > 0
          ? previousCount - 1: 0) 
    } catch (error) {
      console.error("Failed to mark notification as read:",error) 
    }
  } 
  // MARK ALL AS READ
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead() 
      setNotifications((previousNotifications) =>
        previousNotifications.map(
          (notification) => ({...notification,readStatus: true,})
        )
      ) 
      setUnreadCount(0) 
    } catch (error) {
      console.error("Failed to mark all notifications as read:",error) }
  } 
  // DELETE NOTIFICATION
  const handleDelete = async (
    notificationId
  ) => {
    try {
      await deleteNotification(
        notificationId
      ) 
      setNotifications((previousNotifications) =>
        previousNotifications.filter(
          (notification) => notification.id !== notificationId)
      ) 
      const countResponse =
        await getUnreadNotificationCount() 
      setUnreadCount(countResponse.data)  
    } catch (error) {
      console.error("Failed to delete notification:",error) 
    }
  } 
  // LOADING
  if (loading) {
    return (
      <div className="notification-page">
        <h2>Notifications</h2>
        <p>Loading notifications...</p>
      </div>
    ) 
  } 
  // ERROR 
  if (error) {
    return (
      <div className="notification-page">
        <h2>Notifications</h2>
        <p className="error-message">{error}</p>
        <button onClick={loadNotifications}>Try Again</button>
      </div>
    ) 
  } 
  // UI 
  return (
    <div className="notification-page">
      <div className="notification-header">
        <div>
          <h2>Notifications</h2>
          <p> You have{" "}
            <strong>{unreadCount}</strong>{" "}
            unread notification
            {unreadCount !== 1 ? "s" : ""}.
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className="mark-all-button">
            Mark All as Read
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <h3>No Notifications</h3>
          <p>You don't have any notifications yet.</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => (
            <div key={notification.id} className={`notification-card ${
                notification.readStatus? "read" : "unread"}`}>
              <div
                className="notification-content" onClick={() =>handleNotificationClick(
                  notification)}
                style={{cursor: notification.taskId ? "pointer" : "default"}}>
                <div className="notification-message">
                  <h4>
                    {notification.type ==="TASK_ASSIGNED"? "New Task Assigned"
                      : "Notification"}
                  </h4>
                  <p>{notification.message}</p>
                  {notification.taskId && (
                    <small>Task:{" "}{notification.taskTitle}</small>)}
                </div>
                <div className="notification-actions" onClick={(event) =>
                    event.stopPropagation()}>
                  {!notification.readStatus && (
                    <button onClick={() =>handleMarkAsRead(notification.id)}>
                      Mark as Read
                    </button>)}
                  <button onClick={() => handleDelete(notification.id)}>
                    Delete
                  </button>
                </div>
              </div>
              <div className="notification-time">
                {new Date(notification.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ) 
}
export default Notification 