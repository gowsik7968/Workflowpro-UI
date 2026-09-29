import {CheckCircle2,FolderKanban, ListTodo,Users,ArrowRight,} from "lucide-react"  
import { useEffect, useState } from "react"  
import { useNavigate } from "react-router-dom"  
import DashboardStatCard from "../components/DashboardStatCard"  
import { getDashboardStats } from "../services/api"  

function Dashboard() {
  const navigate = useNavigate()  
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    totalTeams: 0,
  })  
  const [loading, setLoading] = useState(true)  
  const [error, setError] = useState("")  
  // LOAD DASHBOARD STATISTICS
  const loadDashboardStats = async () => {
    try {
      setLoading(true)  
      setError("")  
      const response = await getDashboardStats()  
      setStats(response.data)  
    } catch (error) {
      console.error("Failed to load dashboard statistics:",error )  
      setError("Unable to load dashboard statistics.")  
    } finally {
      setLoading(false)  
    }
  }  
  // LOAD DATA WHEN DASHBOARD OPENS
  useEffect(() => {
    loadDashboardStats()  
  }, [])   
  // LOADING
  if (loading) {
    return (
      <>
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Loading your workspace statistics... </p> 
          </div>
        </div>
        <div className="dashboard-content-card">
          <div className="dashboard-empty-state">
            <p>Loading dashboard...</p>
          </div>
        </div>
      </>
    )  
  } 
  // ERROR 
  if (error) {
    return (
      <>
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>
              Welcome back! Here's what's happening
              with your workspace.
            </p>
          </div>
        </div>
        <div className="dashboard-content-card">
          <div className="dashboard-empty-state">
            <h3>Unable to Load Dashboard</h3>
            <p>{error}</p>
            <button className="projects-refresh-btn" onClick={loadDashboardStats}>
              Try Again
            </button>
          </div>
        </div>
      </>
    )  
  }
  return (
    <>
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back! Here's what's happening
            with your workspace.
          </p>
        </div>
      </div>
      {/* Dashboard Statistics */}
      <div className="dashboard-stats">
        <DashboardStatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
        />
        <DashboardStatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={ListTodo}
        />
        <DashboardStatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={CheckCircle2}
        />
        <DashboardStatCard
          title="Team Members"
          value={stats.totalTeams}
          icon={Users}
        />
      </div>
      {/* Dashboard Content */}
      <div className="dashboard-content-grid">
        {/* Recent Projects */}
        <div className="dashboard-content-card">
          <div className="dashboard-card-header">
            <h2>Task Summary</h2>
            <button className="nav-item" onClick={() => navigate("/tasks")} >           
              View Tasks  <ArrowRight size={16} />
            </button>
          </div>
          <div className="dashboard-empty-state">
            <ListTodo size={35} />
            <h3>{stats.totalTasks} Total Tasks </h3> 
            <p>
              {stats.todoTasks} To Do ·{" "}
              {stats.inProgressTasks} In Progress ·{" "}
              {stats.completedTasks} Completed
            </p>
            <button className="projects-refresh-btn" onClick={() => navigate("/tasks")}>
              Go to Tasks <ArrowRight size={16} />  
            </button>
          </div>
        </div>
        {/* My Tasks */}
        <div className="dashboard-content-card">
          <div className="dashboard-card-header">
            <h2>Workspace Overview</h2>
          </div>
          <div className="dashboard-empty-state">
            <Users size={35} />
            <h3>{stats.totalTeams} Teams</h3>
            <p>
              Your workspace currently has{" "}
              {stats.totalProjects} projects and{" "}
              {stats.totalTeams} teams.
            </p>
            <button
              className="projects-refresh-btn"
              onClick={() => navigate("/team")}>
              Go to Team <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  )  
}
export default Dashboard  