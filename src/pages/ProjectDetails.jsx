import { useEffect, useState } from "react"  
import { useNavigate, useParams } from "react-router-dom"  
import {ArrowLeft,CalendarDays,FolderKanban,Pencil,Trash2,RefreshCw,Clock,FileText,} from "lucide-react"  
import {getProjectById,deleteProject,} from "../services/api"  
function ProjectDetails() {
  const { id } = useParams()  
  const navigate = useNavigate()  
  const [project, setProject] = useState(null)  
  const [loading, setLoading] = useState(true)  
  const [error, setError] = useState("")  
  const [deleting, setDeleting] = useState(false)  
  const [success, setSuccess] = useState("")  
  // Fetch selected project from backend
  const fetchProject = async () => {
    try {
      setLoading(true)  
      setError("")  
      const response = await getProjectById(id)  
      setProject(response.data)  
    } catch (err) {
      console.error("Failed to fetch project details:", err)  
      setError(
        err.response?.status === 404
          ? "Project not found. It may have been deleted."
          : err.response?.data?.message ||
              "Unable to load project details. Please try again."
      )  
    } finally {
      setLoading(false)  
    }
  }  
  useEffect(() => {
    fetchProject()  
  }, [id])  
  // Status badge styles
  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "status-completed"  
      case "IN_PROGRESS":
        return "status-in-progress"  
      case "PLANNED":
        return "status-planned"  
      default:
        return "status-default"  
    }
  }  
  // Delete current project
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    )  
    if (!confirmed) return  
    try {
      setDeleting(true)  
      setError("")  
      await deleteProject(project.id)  
      navigate("/projects", {
        state: { success: "Project deleted successfully!" },
      })  
    } catch (err) {
      console.error("Failed to delete project:", err)  
      setError(
        err.response?.data?.message ||
          "Failed to delete project. Please try again."
      )  
    } finally {
      setDeleting(false)  
    }
  }  
  // Loading state
  if (loading) {
    return (
      <div className="projects-page">
        <div className="projects-message">
          <RefreshCw size={26} className="spinning" />
          <p>Loading project details...</p>
        </div>
      </div>
    )  
  }
  // Error / not found state
  if (error && !project) {
    return (
      <div className="projects-page">
        <button
          type="button"
          className="projects-refresh-btn"
          onClick={() => navigate("/projects")} >
          <ArrowLeft size={17} />Back to Projects
        </button>
        <div className="projects-error">
          <p>{error}</p>
          <button type="button" onClick={fetchProject}>
            Try Again
          </button>
        </div>
      </div>
    )  
  }
  if (!project) return null  
  return (
    <div className="projects-page">
      {/* Header */}
      <div className="projects-header">
        <div>
          <button
            type="button"
            className="projects-refresh-btn"
            onClick={() => navigate("/projects")}>
            <ArrowLeft size={17} />
            Back to Projects
          </button>
          <h1 className="projects-title" style={{ marginTop: "16px" }}>
            Project Details
          </h1>
          <p className="projects-subtitle">
            View complete information about this project.
          </p>
        </div>
        <div className="projects-header-actions">
          <button
            type="button"
            className="project-edit-btn"
            onClick={() => navigate("/projects")}
            disabled={deleting}
            title="Return to the projects list to edit"
          >
            <Pencil size={16} />
            Edit Project
          </button>
          <button
            type="button"
            className="project-delete-btn"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 size={16} />
            {deleting ? "Deleting..." : "Delete Project"}
          </button>
        </div>
      </div>
      {error && (
        <div className="projects-error">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="projects-success">
          {success}
        </div>
      )}
      {/* Project Overview */}
      <div className="projects-table-container">
        <div className="projects-table-heading">
          <div className="project-name">
            <div className="project-row-icon">
              <FolderKanban size={22} />
            </div>
            <div>
              <h2>{project.name}</h2>
              <span>Project ID: {project.id}</span>
            </div>
          </div>
          <span
            className={`project-status ${getStatusStyle(project.status)}`}>
            {project.status?.replaceAll("_", " ") || "UNKNOWN"}
          </span>
        </div>
        <div style={{ padding: "24px" }}>
          {/* Description */}
          <div style={{ marginBottom: "28px" }}>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <FileText size={19} />
              Project Description
            </h3>
            <p style={{ lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
              {project.description || "No description provided."}
            </p>
          </div>
          {/* Dates */}
          <div className="project-form-grid">
            <div className="project-form-group">
              <label>
                <CalendarDays size={16}style={{display: "inline",marginRight: "6px",
                    verticalAlign: "middle"}}/>
                Start Date
              </label>
              <p>{project.startDate || "Not specified"}</p>
            </div>
            <div className="project-form-group">
              <label>
                <CalendarDays
                  size={16}
                  style={{display: "inline",marginRight: "6px",
                  verticalAlign: "middle",}}/>
                Due Date
              </label>
              <p>{project.dueDate || "Not specified"}</p>
            </div>
            <div className="project-form-group">
              <label>
                <Clock size={16}
                  style={{
                    display: "inline",marginRight: "6px",verticalAlign: "middle",}}/>
                Current Status
              </label>
              <p>{project.status?.replaceAll("_", " ") || "Unknown"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )  
}
export default ProjectDetails  