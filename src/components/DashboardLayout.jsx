import { useEffect, useState } from "react" 
import { useNavigate, Outlet, useLocation } from "react-router-dom" 
import {LayoutDashboard,FolderKanban,ListTodo,Users,Bell,History,ShieldCheck,
  LogOut,} from "lucide-react" 
import {getUnreadNotificationCount,getCurrentUserFromToken,} from "../services/api" 

function DashboardLayout() {
  const navigate = useNavigate() 
  const location = useLocation() 
  const [unreadCount, setUnreadCount] = useState(0) 
  // CURRENT USER
  const currentUser = getCurrentUserFromToken() 
  const userRole = currentUser?.role || null 
  const isUser = userRole === "USER" 
  const isTeamLead = userRole === "TEAM_LEAD" 
  const isManager = userRole === "MANAGER" 
  const isAdmin = userRole === "ADMIN" 
  // LOAD UNREAD NOTIFICATION COUNT
  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadNotificationCount() 
      setUnreadCount(response.data) 
    } catch (error) {
      console.error(
        "Failed to load notification count:",
        error
      ) 
    }
  } 
  // INITIAL LOAD + POLLING
  useEffect(() => {
    loadUnreadCount() 
    const notificationInterval = setInterval(() => {
      loadUnreadCount() 
    }, 30000) 
    return () => {
      clearInterval(notificationInterval) 
    } 
  }, []) 
  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token") 
    navigate("/login", { replace: true }) 
  } 
  return (
    <div className="dashboard-page">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        {/* Logo */}
        <div className="dashboard-logo">
          <FolderKanban size={28} />
          <h2>WorkFlowPro</h2>
        </div>
        {/* Navigation */}
        <nav className="dashboard-nav">
          {/* Dashboard */}
          <button
            className={`nav-item ${
              location.pathname === "/dashboard"
                ? "active": ""}`}
            onClick={() => navigate("/dashboard")}>
            <LayoutDashboard size={19} />
            Dashboard
          </button>
          {/* Projects */}
          <button
            className={`nav-item ${
              location.pathname.startsWith("/projects")? "active": ""}`}
            onClick={() => navigate("/projects")}>
            <FolderKanban size={19} />
            Projects
          </button>
          {/* Tasks */}
          <button
            className={`nav-item ${
              location.pathname.startsWith("/tasks")? "active": ""}`}
            onClick={() => navigate("/tasks")}>
            <ListTodo size={19} />
            Tasks
          </button>
          {/* Team */}
          <button
            className={`nav-item ${
              location.pathname.startsWith("/team")? "active": ""}`}
            onClick={() => navigate("/team")}>
            <Users size={19} />
            Team
          </button>
          {/* Notifications */}
          <button
            className={`nav-item notification-nav-item ${
              location.pathname.startsWith("/notifications")? "active": ""}`}
            onClick={() => navigate("/notifications")}>
            <Bell size={19} />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount}
              </span>
            )}
          </button>
          {/* Activity Log */}
          <button
            className={`nav-item ${
              location.pathname.startsWith("/activities")? "active": ""}`}
            onClick={() => navigate("/activities")}
          >
            <History size={19} />
            Activity Log
          </button>
          {/* ADMIN USER MANAGEMENT */}
          {isAdmin && (
            <button
              className={`nav-item ${
                location.pathname.startsWith("/admin/users")? "active": ""}`}
              onClick={() => navigate("/admin/users")}>
              <ShieldCheck size={19} />
              User Management
            </button>
          )}
        </nav>
        {/* LOGOUT */}
        <button
          className="dashboard-logout"
          onClick={handleLogout}>
          <LogOut size={19} />
          Logout
        </button>
      </aside>
      {/* PAGE CONTENT */}
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  ) 
}

export default DashboardLayout 