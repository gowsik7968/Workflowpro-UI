import { useEffect, useState } from "react"  
import { useNavigate } from "react-router-dom"  
import {CalendarDays,FolderKanban, Plus, X,Pencil,Trash2,Eye,RefreshCw,} from "lucide-react"  
import {getAllProjects, createProject,updateProject,deleteProject,} from "../services/api"   
function Projects() {
  const navigate = useNavigate()  
  // GET CURRENT USER ROLE
  const getUserRole = () => {
    const token = localStorage.getItem("token")  
    if (!token) {
      return null  
    }
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      )  
      return payload.role || null  
    } catch (error) {
      console.error("Failed to read user role:",error)  
      return null  
    }
  }  
  const userRole = getUserRole()  
  // ROLE PERMISSIONS
  const canCreateProject =userRole === "MANAGER" || userRole === "ADMIN"
  const canEditProject = userRole === "MANAGER" || userRole === "ADMIN"  
  const canDeleteProject = userRole === "ADMIN"  
  // STATE
  const [projects, setProjects] = useState([])  
  const [loading, setLoading] = useState(true)  
  const [error, setError] = useState("")  
  const [showForm, setShowForm] = useState(false)  
  const [saving, setSaving] = useState(false)  
  const [deletingId, setDeletingId] = useState(null)  
  const [editingProjectId, setEditingProjectId] =useState(null)  
  const [formError, setFormError] = useState("")  
  const [success, setSuccess] = useState("")  
  const initialFormData = {
    name: "",
    description: "",
    status: "PLANNED",
    startDate: "",
    dueDate: "",
  }  
  const [formData, setFormData] =useState(initialFormData)  
  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      setLoading(true)  
      setError("")  
      const response = await getAllProjects()  
      setProjects(Array.isArray(response.data)? response.data : [])  
    } catch (err) {
      console.error("Failed to fetch projects:",err)  
      setError(err.response?.data?.message ||
          "Unable to load projects. Please check the backend server.")  
    } finally {
      setLoading(false)  
    }
  }  
  // LOAD PROJECTS
  useEffect(() => {
    fetchProjects()  
  }, [])  
  // FORM CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))  
  }  
  // OPEN CREATE FORM
  const handleOpenForm = () => {
    if (!canCreateProject) {
      return  
    }
    setEditingProjectId(null)  
    setFormData(initialFormData)  
    setFormError("")  
    setSuccess("")  
    setShowForm(true)  
  }  
  // OPEN EDIT FORM
  const handleEditProject = (project) => {
    if (!canEditProject) {
      return  
    }
    setEditingProjectId(project.id)  
    setFormData({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "PLANNED",
      startDate: project.startDate || "",
      dueDate: project.dueDate || "",
    })  
    setFormError("")  
    setSuccess("")  
    setShowForm(true)  
  }  
  // CLOSE FORM
  const handleCloseForm = () => {
    setShowForm(false)  
    setEditingProjectId(null)  
    setFormError("")  
    setFormData(initialFormData)  
  }  
  // CREATE / UPDATE PROJECT
  const handleSubmit = async (e) => {
    e.preventDefault()  
    setFormError("")  
    setSuccess("")  
    // SECURITY CHECK
    if (
      editingProjectId !== null &&
      !canEditProject
    ) {setFormError("You do not have permission to edit projects.")  
      return  
    }
    if (editingProjectId === null &&!canCreateProject) {
      setFormError("You do not have permission to create projects.")  
      return  
    } 
    // VALIDATION 
    if (!formData.name.trim()) {setFormError("Project name is required.")  
      return  
    }
    if (formData.startDate &&formData.dueDate &&formData.dueDate < formData.startDate) {
      setFormError("Due date cannot be before the start date.")  
      return  
    }
    const projectData = {...formData,name: formData.name.trim(),
      description:formData.description.trim(),
      startDate:formData.startDate || null,
      dueDate:formData.dueDate || null,
    }  
    // SAVE
    try {
      setSaving(true)  
      if (editingProjectId !== null) {
        await updateProject(editingProjectId,projectData)
        setSuccess("Project updated successfully!")    
      } else {
        await createProject(projectData) 
        setSuccess("Project created successfully!")  
      }
      handleCloseForm()  
      await fetchProjects()  
    } catch (err) {
      console.error("Failed to save project:", err) 
      if (err.response?.status === 403) {
        setFormError("You do not have permission to perform this action.")  
      } else {
        setFormError(err.response?.data?.message || "Failed to save project. Please try again.")  
      }
    } finally {
      setSaving(false)  
    }
  }  
  //DELETE PROJECT
  const handleDeleteProject = async (project) => {
    if (!canDeleteProject) {
      setError( "Only an ADMIN can delete projects." ) 
      return  
    }
    const confirmed = window.confirm(`Are you sure you want to delete "${project.name}"?`)  
    if (!confirmed) {
      return  
    }
    try {
      setDeletingId(project.id)  
      setError("")  
      setSuccess("")  
      await deleteProject(project.id)  
      setSuccess("Project deleted successfully!")  
      await fetchProjects()  
    } catch (err) {
      console.error("Failed to delete project:",err)  
      if (err.response?.status === 403) {
        setError("You do not have permission to delete this project.")  
      } else {
        setError(err.response?.data?.message ||"Failed to delete project. Please try again.")  
      }
    } finally {
      setDeletingId(null)  
    }
  }  
  // VIEW PROJECT
  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`)  
  }  
  // STATUS STYLE
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
  // JSX
  return (
    <div className="projects-page">
      {/* PAGE HEADER */}
      <div className="projects-header">
        <div>
          <h1 className="projects-title">Projects</h1>
          <p className="projects-subtitle">
            Manage and track all your projects
            in one place.
          </p>
        </div>
        <div className="projects-header-actions">
          {/* CREATE PROJECT */}
          {canCreateProject && (
            <button className="projects-create-btn"onClick={handleOpenForm}
              disabled={saving}>
              <Plus size={18} />New Project
            </button>
          )}
          {/* REFRESH */}
          <button className="projects-refresh-btn" onClick={fetchProjects}
           disabled={loading}>
              <RefreshCw size={17}
              className={loading ? "refresh-icon spinning" : "refresh-icon"}/>
              Refresh
          </button>
        </div>
      </div>
      {/* CURRENT ROLE */}
      <div className="projects-role-info">
        Current Role:{" "}
        <strong>{userRole || "USER"}</strong>
      </div>
      <br></br>
      {/* SUCCESS */}
      {success && (<div className="projects-success">{success}</div>)}
      {/* CREATE / EDIT FORM */}
      {showForm && (
        <div className="project-form-container">
          <div className="project-form-header">
            <div>
              <h2>
                {editingProjectId !== null? "Edit Project": "Create New Project"}
              </h2>
              <p>
                {editingProjectId !== null
                  ? "Update your project details."
                  : "Enter the details of your new project."}
              </p>
            </div>
            <button type="button"className="project-form-close"onClick={handleCloseForm}
              disabled={saving}>
              <X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="project-form-grid">
              {/* PROJECT NAME */}
              <div className="project-form-group">
                <label htmlFor="name">Project Name </label>
                <input id="name"type="text"name="name"placeholder="Enter project name"
                  value={formData.name}onChange={handleChange}required maxLength={150}/>
              </div>
              {/* STATUS */}
              <div className="project-form-group">
                <label htmlFor="status">Project Status</label>
                <select id="status"name="status"value={formData.status}onChange={handleChange}>                                  
                  <option value="PLANNED">Planned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>  
                </select>
              </div>
              {/* START DATE */}
              <div className="project-form-group">
                <label htmlFor="startDate">Start Date </label>
                <input id="startDate"type="date"name="startDate" value={formData.startDate}
                  onChange={handleChange}/>
              </div>
              {/* DUE DATE */}
              <div className="project-form-group">
                <label htmlFor="dueDate">Due Date</label>  
                <input id="dueDate" type="date"name="dueDate"min={formData.startDate ||undefined }
                 value={formData.dueDate}onChange={handleChange}/>
              </div>
              {/* DESCRIPTION */}
              <div className="project-form-group project-description-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description"placeholder="Describe your project..."
                  value={formData.description}onChange={handleChange}rows={4}maxLength={1000}/>
              </div>
            </div>
            {formError && (
              <div className="projects-error">
                <p>{formError}</p>
              </div>
            )}
            <div className="project-form-actions">
              <button type="button" className="project-cancel-btn"onClick={handleCloseForm}
                disabled={saving}>Cancel
              </button>
              <button type="submit"className="project-save-btn"disabled={saving}>
                {saving ? "Saving..." : editingProjectId !== null ? "Update Project"
                  : "Create Project"}
               </button>  
            </div>
          </form>
        </div>
      )}
      {/* PROJECT SUMMARY */}
      <div className="projects-summary">
        <div className="summary-icon">
          <FolderKanban size={25} />
        </div>
        <div>
          <p className="summary-label">Total Projects</p>
          <h2 className="summary-count">{projects.length}</h2>
        </div>
      </div>        
      {/* LOADING */}
      {loading && (
        <div className="projects-message">
          <RefreshCw className="spinning" size={26}  />
          <p>Loading projects...</p>
        </div>
      )}
      {/* ERROR */}
      {!loading && error && (
        <div className="projects-error">
          <p>{error}</p>
          <button onClick={fetchProjects}>Try Again </button>
        </div>
      )}       
      {/* EMPTY */}
      {!loading && !error &&
        projects.length === 0 && (
          <div className="projects-empty">
            <FolderKanban size={42} />
            <h3> No Projects Found </h3>
            <p>
              Your projects will appear here
              once they are created.
            </p>
          </div>
        )} 
      {/* PROJECT TABLE */}
      {!loading && !error &&
        projects.length > 0 && (
        <div className="projects-table-container">
          <div className="projects-table-heading">
            <h2>All Projects</h2>
            <span>{projects.length} projects</span>
          </div>
          <div className="projects-table-scroll">
            <table className="projects-table">
            <thead>
              <tr>
                <th>Project Details </th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>    
            </thead>        
            <tbody>      
              {projects.map(
                (project) => (
                <tr key={project.id}>
                  {/* PROJECT */}
                <td>
                  <div className="project-name">
                    <div className="project-row-icon">
                      <FolderKanban size={19}/>
                    </div>
                    <div>
                      <h4>{project.name}</h4>
                      <p>{project.description ||"No description"}</p>   
                    </div>
                  </div>
                </td>
                {/* STATUS */}
                <td>
                  <span className={`project-status ${getStatusStyle(project.status)}`}>
                  {project.status?.replaceAll( "_", " ") ||"UNKNOWN"}</span>
                </td>          
              {/* START DATE */}
                <td>
                  <span className="project-date">
                    <CalendarDays size={15} />{project.startDate ||"—"}</span>
                </td>   
              {/* DUE DATE */}
                <td>
                  <span className="project-date"><CalendarDays size={15}/>
                    {project.dueDate ||"—"}</span>
                </td>
                {/* ACTIONS */}
                <td>
                  <div className="project-actions">
                  {/* VIEW */}        
                  <button type="button" className="project-edit-btn"onClick={() =>
                  handleViewProject(project.id)} disabled={saving ||deletingId !==  null}   
                  title="View project details" > <Eye size={16} />  View     
                  </button>
                  {/* EDIT */}
                  {canEditProject && (
                    <button type="button" className="project-edit-btn"
                    onClick={() => handleEditProject(project)}disabled={saving ||     
                    deletingId !== null}title="Edit project"> 
                    <Pencil size={16}/>
                      Edit
                    </button>)}
                  {/* DELETE */}
                  {canDeleteProject && (
                    <button type="button" className="project-delete-btn"
                      onClick={() => handleDeleteProject(project)}
                      disabled={deletingId !==null ||saving }title="Delete project">
                      <Trash2 size={16}/>
                      {deletingId === project.id ? "Deleting...": "Delete"}
                    </button>)}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  )  
}
export default Projects  
