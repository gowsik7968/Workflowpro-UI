import { useEffect, useState } from "react"  
import {getAdminUsers,changeUserRole,deleteAdminUser,} from "../services/api"  
function AdminUsers() {
  const [users, setUsers] = useState([])  
  const [loading, setLoading] = useState(true)  
  const [error, setError] = useState("")  
  const [success, setSuccess] = useState("")  
  const [deletingUserId, setDeletingUserId] = useState(null)  
  const [changingRoleUserId, setChangingRoleUserId] = useState(null)  
  // LOAD USERS
  const loadUsers = async () => {
    try {
      setLoading(true)  
      setError("")  
      const response = await getAdminUsers()  
      setUsers(
        Array.isArray(response.data)
          ? response.data : [])  
    } catch (error) {
      console.error("Failed to load users:", error)  
      setError(error.response?.data?.message ||"Unable to load users.")  
    } finally {
      setLoading(false)  
    }
  }  
  // INITIAL LOAD
  useEffect(() => {
    loadUsers()  
  }, [])  
  // CHANGE USER ROLE
  const handleRoleChange = async (userId, role) => {
    try {
      setError("")  
      setSuccess("")  
      setChangingRoleUserId(userId)  
      const response = await changeUserRole(userId,role)  
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId
            ? response.data : user))  
      setSuccess(`User role changed to ${role} successfully.`)  
    } catch (error) {
      console.error("Failed to change role:",error)  
      setError(error.response?.data?.message ||"Unable to update user role.")  
      // Reload users in case backend state changed
      await loadUsers()  
    } finally {setChangingRoleUserId(null)}
  }  
  // DELETE USER
  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.fullName}"?`
    )  
    if (!confirmed) {
      return  
    }
    try {
      setError("")  
      setSuccess("")  
      setDeletingUserId(user.id)  
      await deleteAdminUser(user.id)  
      setUsers((currentUsers) =>
        currentUsers.filter(
          (currentUser) =>
            currentUser.id !== user.id
        )
      )  
      setSuccess(
        `${user.fullName} was deleted successfully.`
      )  
    } catch (error) {
      console.error(
        "Failed to delete user:",
        error
      )  
      setError(
        error.response?.data?.message ||
          "Unable to delete user."
      )  
    } finally {
      setDeletingUserId(null)  
    }
  }  
  // ROLE DISPLAY
  const getRoleLabel = (role) => {
    switch (role) {
      case "USER":
        return "User"  
      case "TEAM_LEAD":
        return "Team Lead"  
      case "MANAGER":
        return "Manager"  
      case "ADMIN":
        return "Admin"  
      default:
        return role || "Unknown"  
    }
  }  
  // ROLE CLASS
  const getRoleClass = (role) => {
    switch (role) {
      case "USER":
        return "role-user"  

      case "TEAM_LEAD":
        return "role-team-lead"  

      case "MANAGER":
        return "role-manager"  

      case "ADMIN":
        return "role-admin"  

      default:
        return "role-default"  
    }
  }  
  // LOADING
  if (loading) {
    return (
      <div className="admin-users-page">
        <div className="admin-users-header">
          <div>
            <h2>User Management</h2>
            <p>
              Manage WorkFlowPro users and
              their roles.
            </p>
          </div>
        </div>
        <div className="dashboard-empty-state">
          <p>Loading users...</p>
        </div>
      </div>
    )  
  } 
  // PAGE 
  return (
    <div className="admin-users-page">
      {/* HEADER */}
      <div className="admin-users-header">
        <div> 
          <h2>User Management</h2>
          <p>
            Manage WorkFlowPro users and
            their roles.
          </p>
        </div>
      </div>
      {/* ERROR */}
      {error && (
        <div className="error-message">{error}</div>)}
      {/* SUCCESS */}
      {success && (
        <div className="success-message">{success}</div>)}
      {/* USER COUNT */}
      <div className="admin-users-summary">
        <h3>Total Users: {users.length}</h3>
      </div>
      {/* USERS */}
      {users.length === 0 ? (
        <div className="dashboard-empty-state">
          <h3>No Users</h3>
          <p>No users are available.</p>
        </div>
      ) : (
        <div className="admin-users-table-wrapper">
          <table className="admin-users-table">
            {/* TABLE HEADER */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            {/* TABLE BODY */}
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td><strong>{user.fullName}</strong></td>
                  <td>{user.email}</td>
                  <td><div className="admin-user-role">
                    <span className={`admin-role-badge ${getRoleClass(user.role)}  `}>
                        {getRoleLabel(user.role)}
                    </span>
                      <select value={user.role}onChange={(e) =>
                        handleRoleChange(user.id,e.target.value)}
                        disabled={changingRoleUserId === user.id ||
                          deletingUserId === user.id}>
                        <option value="USER">User</option>
                        <option value="TEAM_LEAD">Team Lead</option>
                        <option value="MANAGER">Manager </option>
                        <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                    {changingRoleUserId === user.id && (
                      <small>Updating role...</small>)}
                </td> 
                  {/* CREATED DATE */}
                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString(): "-"}
                  </td>
                  {/* DELETE */}
                  <td>
                    <button type="button" className="admin-delete-user-btn"
                     onClick={() => handleDeleteUser(user)}disabled={deletingUserId ===
                          user.id ||changingRoleUserId === user.id  }>
                      {deletingUserId === user.id  ? "Deleting...": "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )  
}
export default AdminUsers  
