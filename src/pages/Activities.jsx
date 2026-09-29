import { useEffect, useState } from "react"  
import {getAllActivities,getMyActivities,} from  "../services/api"
function Activities() {
  const [activities, setActivities] = useState([])  
  const [filter, setFilter] = useState("ALL")  
  const [loading, setLoading] = useState(true)  
  const [error, setError] = useState("")  
  const loadActivities = async () => {
    try {
      setLoading(true)  
      setError("")  
      const response =
        filter === "MY"
          ? await getMyActivities() : await getAllActivities()  
      setActivities(response.data)  
    } catch (error) {
      console.error("Failed to load activities:",error)  
      setError("Unable to load activity logs. Please try again.")  
    } finally {
      setLoading(false)  
    }
  }  
  useEffect(() => {
    loadActivities()  
  }, [filter])  
  if (loading) {
    return (
      <div className="activity-page">
        <h2>Activity Log</h2>
        <p>Loading activities...</p>
      </div>
    )  
  }
  if (error) {
    return (
      <div className="activity-page">
        <h2>Activity Log</h2>
        <p className="error-message">{error}</p>
        <button onClick={loadActivities}>Try Again</button>
      </div>
    )  
  }
  return (
    <div className="activity-page">
      {/* HEADER */}
      <div className="activity-header">
        <div>
          <h2>Activity Log</h2>
          <p>
            Track important actions performed
            in WorkFlowPro.
          </p>
        </div>
        {/* FILTER */}
        <div className="activity-filter">
          <button className={filter === "ALL"? "active" : ""}
            onClick={() =>setFilter("ALL")}>
            All Activities
          </button>
          <button className={ filter === "MY" ? "active" : ""}
            onClick={() =>setFilter("MY")}>
            My Activities
          </button>
        </div>
      </div>
      {/* EMPTY */}
      {activities.length === 0 ? (
        <div className="empty-activities">
          <h3>No Activities</h3>
          <p>No activity records are available.</p>
        </div>
      ) : (
        <div className="activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-card">
              {/* ACTION */}
              <div className="activity-action">
                <strong>{activity.action}</strong>
              </div>
              {/* DETAILS */}
              <div className="activity-details">
                <p>{activity.description}</p>
                <div className="activity-meta">
                  <span>User:{" "}
                    <strong>{activity.userName}</strong>
                  </span>
                  <span>
                    {activity.entityType}
                    {activity.entityId ? ` #${activity.entityId}`: ""}
                  </span>
                  <span>
                    {new Date(activity.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )  
}
export default Activities  