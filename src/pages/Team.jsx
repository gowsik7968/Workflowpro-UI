import { useEffect, useState } from "react"  
import {getMyTeams,getTeamById,createTeam,addTeamMember,removeTeamMember,deleteTeam,} from "../services/api"  
import {ROLES,
  getCurrentUserRole,
} from "../utils/permission"  
const canCreateTeam = (role) => {
  return [
    ROLES.TEAM_LEAD,
    ROLES.MANAGER,
    ROLES.ADMIN,
  ].includes(role)  
}  
const canManageMembers = (role) => {
  return [
    ROLES.TEAM_LEAD,
    ROLES.MANAGER,
    ROLES.ADMIN,
  ].includes(role)  
}  
const canDeleteAnyTeam = (role) => {
  return role === ROLES.ADMIN  
}  
const canDeleteOwnTeam = (role) => {
  return [
    ROLES.TEAM_LEAD,
    ROLES.ADMIN,
  ].includes(role)  
}  
// CURRENT USER EMAIL
const getCurrentUserEmail = () => {
  try {
    const token =
      localStorage.getItem("token")  

    if (!token) {
      return ""  
    }

    const payload = JSON.parse(
      atob(token.split(".")[1])
    )  
    return payload.sub || ""  
  } catch (error) {
    console.error("Unable to read user email from token:",error)  
    return ""  
  }
}  
function Team() {
  const [teams, setTeams] = useState([])  
  const [selectedTeam, setSelectedTeam] =useState(null)  
  const [name, setName] = useState("")  
  const [description, setDescription] =useState("")  
  const [memberEmail, setMemberEmail] =useState("")  
  const [showForm, setShowForm] =useState(false)  
  const [loading, setLoading] =useState(true)  
  const [saving, setSaving] =useState(false)  
  const [error, setError] =useState("")  
  const [success, setSuccess] =useState("")  
  // CURRENT USER
  const currentUserRole =getCurrentUserRole() || ROLES.USER  
  const currentUserEmail =getCurrentUserEmail()  
  // ERROR MESSAGE
  const getErrorMessage = (err) =>
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    "Something went wrong. Please try again."  
  // TEAM MANAGEMENT PERMISSION
  const canManageSelectedTeam = (team) => {
    if (!team) {
      return false  
    }
    // ADMIN can manage every team
    if (currentUserRole === ROLES.ADMIN) {
      return true  
    }
    // MANAGER can manage every team
    if (currentUserRole === ROLES.MANAGER) {
      return true  
    }
    // TEAM_LEAD can manage only their own team
    if (
      currentUserRole ===
      ROLES.TEAM_LEAD
    ) {
      return (
        team.ownerEmail?.toLowerCase() ===
        currentUserEmail.toLowerCase()
      )  
    }
    // USER cannot manage members
    return false  
  }  
  //DELETE TEAM PERMISSION
  const canDeleteTeam = (team) => {
    if (!team) {
      return false  
    }
    // ADMIN can delete any team
    if (
      canDeleteAnyTeam(
        currentUserRole
      )
    ) {
      return true  
    }
    // TEAM_LEAD can delete only their own team
    if (
      canDeleteOwnTeam(
        currentUserRole
      )
    ) {
      return (
        team.ownerEmail?.toLowerCase() ===
        currentUserEmail.toLowerCase()
      )  
    }
    // MANAGER cannot delete teams
    // USER cannot delete teams
    return false  
  }  
  // LOAD TEAM
  const loadTeams = async () => {
    try {
      setLoading(true)  
      setError("")  
      const response =await getMyTeams()  
      setTeams(
        Array.isArray(response.data)? response.data: [])  
    } catch (err) {
      console.error("Error loading teams:",err)  
      setError(
        getErrorMessage(err)
      )  
    } finally {
      setLoading(false)  
    }
  }  
  useEffect(() => {
    loadTeams()  
  }, [])  
    
  // CREATE TEAM
    

  const handleCreateTeam = async (e) => {
    e.preventDefault()  

    if (
      !canCreateTeam(
        currentUserRole
      )
    ) {
      setError(
        "You do not have permission to create a team."
      )  
      return  
    }

    if (!name.trim()) {
      setError(
        "Team name is required."
      )  
      return  
    }

    try {
      setSaving(true)  
      setError("")  
      setSuccess("")  

      await createTeam({
        name: name.trim(),
        description:
          description.trim(),
      })  

      setName("")  
      setDescription("")  
      setShowForm(false)  

      setSuccess(
        "Team created successfully!"
      )  

      await loadTeams()  
    } catch (err) {
      console.error(
        "Error creating team:",
        err
      )  

      setError(
        getErrorMessage(err)
      )  
    } finally {
      setSaving(false)  
    }
  }  

    
  // VIEW TEAM
    

  const handleViewTeam = async (
    teamId
  ) => {
    try {
      setError("")  
      setSuccess("")  

      const response =
        await getTeamById(teamId)  

      setSelectedTeam(
        response.data
      )  
    } catch (err) {
      console.error(
        "Error loading team:",
        err
      )  

      setError(
        getErrorMessage(err)
      )  
    }
  }  

    
  // ADD MEMBER
    

  const handleAddMember = async (e) => {
    e.preventDefault()  

    if (
      !canManageSelectedTeam(
        selectedTeam
      )
    ) {
      setError(
        "You do not have permission to manage members of this team."
      )  
      return  
    }

    if (!memberEmail.trim()) {
      setError(
        "Enter the member's email."
      )  
      return  
    }

    try {
      setSaving(true)  
      setError("")  
      setSuccess("")  

      await addTeamMember(
        selectedTeam.id,
        memberEmail
          .trim()
          .toLowerCase()
      )  

      setMemberEmail("")  

      setSuccess(
        "Team member added successfully!"
      )  

      await handleViewTeam(
        selectedTeam.id
      )  

      await loadTeams()  
    } catch (err) {
      console.error(
        "Error adding team member:",
        err
      )  

      setError(
        getErrorMessage(err)
      )  
    } finally {
      setSaving(false)  
    }
  }  

    
  // REMOVE MEMBER
    

  const handleRemoveMember = async (
    email
  ) => {
    if (
      !canManageSelectedTeam(
        selectedTeam
      )
    ) {
      setError(
        "You do not have permission to manage members of this team."
      )  
      return  
    }

    const confirmed =
      window.confirm(
        `Remove ${email} from this team?`
      )  

    if (!confirmed) {
      return  
    }

    try {
      setSaving(true)  
      setError("")  
      setSuccess("")  

      await removeTeamMember(
        selectedTeam.id,
        email
      )  

      setSuccess(
        "Member removed successfully!"
      )  

      await handleViewTeam(
        selectedTeam.id
      )  

      await loadTeams()  
    } catch (err) {
      console.error(
        "Error removing team member:",
        err
      )  

      setError(
        getErrorMessage(err)
      )  
    } finally {
      setSaving(false)  
    }
  }  

    
  // DELETE TEAM
    

  const handleDeleteTeam = async (
    team
  ) => {
    if (!canDeleteTeam(team)) {
      setError(
        "You do not have permission to delete this team."
      )  
      return  
    }

    const confirmed =
      window.confirm(
        `Delete the team "${team.name}"? This cannot be undone.`
      )  

    if (!confirmed) {
      return  
    }

    try {
      setSaving(true)  
      setError("")  
      setSuccess("")  

      await deleteTeam(team.id)  

      setSelectedTeam(null)  

      setSuccess(
        "Team deleted successfully!"
      )  

      await loadTeams()  
    } catch (err) {
      console.error(
        "Error deleting team:",
        err
      )  

      if (
        err.response?.status ===
        403
      ) {
        setError(
          "403 Forbidden: You do not have permission to delete this team."
        )  
      } else {
        setError(
          getErrorMessage(err)
        )  
      }
    } finally {
      setSaving(false)  
    }
  }  

    
  // JSX
    

  return (
    <div className="team-page">

      <div className="team-container">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="team-header">

          <div className="team-header-content">

            <h1 className="team-title">
              Team Management
            </h1>

            <p className="team-subtitle">
              Create teams and manage
              your team members.
            </p>

          </div>

          {/* CREATE TEAM */}

          {canCreateTeam(
            currentUserRole
          ) && (

            <button
              type="button"
              className="team-btn team-btn-primary team-create-toggle"
              onClick={() => {
                setShowForm(
                  !showForm
                )  

                setError("")  
                setSuccess("")  
              }}
            >
              {showForm
                ? "Cancel"
                : "+ Create Team"}
            </button>

          )}

        </div>

        {/* ================================================= */}
        {/* CURRENT ROLE */}
        {/* ================================================= */}

        <div className="team-role-info">

          <strong>
            Role:
          </strong>{" "}

          {currentUserRole.replace(
            "_",
            " "
          )}

        </div>

        {/* ================================================= */}
        {/* ALERTS */}
        {/* ================================================= */}

        {error && (

          <div className="team-alert team-alert-error">
            {error}
          </div>

        )}

        {success && (

          <div className="team-alert team-alert-success">
            {success}
          </div>

        )}

        {/* ================================================= */}
        {/* CREATE TEAM FORM */}
        {/* ================================================= */}

        {showForm &&
          canCreateTeam(
            currentUserRole
          ) && (

            <form
              onSubmit={
                handleCreateTeam
              }
              className="team-form team-create-form"
            >

              <h2 className="team-section-title">
                Create New Team
              </h2>

              {/* TEAM NAME */}

              <div className="team-form-group">

                <label htmlFor="teamName">
                  Team Name *
                </label>

                <input
                  id="teamName"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  maxLength={100}
                  placeholder="Enter team name"
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div className="team-form-group">

                <label htmlFor="teamDescription">
                  Description
                </label>

                <textarea
                  id="teamDescription"
                  value={
                    description
                  }
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  maxLength={1000}
                  rows={3}
                  placeholder="Enter team description"
                />

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="team-btn team-btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Creating..."
                  : "Create Team"}
              </button>

            </form>

          )}

        {/* ================================================= */}
        {/* TEAM LIST */}
        {/* ================================================= */}

        <section className="team-list-section">

          <h2 className="team-section-title">
            My Teams ({teams.length})
          </h2>

          {loading ? (

            <div className="team-state-message">
              Loading teams...
            </div>

          ) : teams.length === 0 ? (

            <div className="team-empty-state">

              <p>
                No teams found.
              </p>

              <span>

                {canCreateTeam(
                  currentUserRole
                )
                  ? "Create your first team to get started."
                  : "You are not currently part of any team."}

              </span>

            </div>

          ) : (

            <div className="team-grid">

              {teams.map(
                (team) => (

                  <article
                    className="team-card"
                    key={team.id}
                  >

                    {/* CARD HEADER */}

                    <div className="team-card-header">

                      <h3 className="team-card-title">
                        {team.name}
                      </h3>

                      <span className="team-card-badge">
                        Team
                      </span>

                    </div>

                    {/* DESCRIPTION */}

                    <p className="team-card-description">
                      {team.description ||
                        "No description provided."}
                    </p>

                    {/* INFO */}

                    <div className="team-card-info">

                      <p>

                        <strong>
                          Owner:
                        </strong>

                        <span>
                          {team.ownerEmail}
                        </span>

                      </p>

                      <p>

                        <strong>
                          Members:
                        </strong>

                        <span>
                          {team.memberEmails
                            ?.length || 0}
                        </span>

                      </p>

                    </div>

                    {/* ACTIONS */}

                    <div className="team-card-actions">

                      {/* VIEW */}

                      <button
                        type="button"
                        className="team-btn team-btn-view"
                        onClick={() =>
                          handleViewTeam(
                            team.id
                          )
                        }
                      >
                        View Team
                      </button>

                      {/* DELETE */}

                      {canDeleteTeam(
                        team
                      ) && (

                        <button
                          type="button"
                          className="team-btn team-btn-danger"
                          onClick={() =>
                            handleDeleteTeam(
                              team
                            )
                          }
                          disabled={saving}
                        >
                          {saving
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      )}

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

        {/* ================================================= */}
        {/* SELECTED TEAM DETAILS */}
        {/* ================================================= */}

        {selectedTeam && (

          <section className="team-details">

            {/* DETAILS HEADER */}

            <div className="team-details-header">

              <div className="team-details-heading">

                <h2 className="team-details-title">
                  {selectedTeam.name}
                </h2>

                <p className="team-details-description">
                  {selectedTeam.description ||
                    "No description"}
                </p>

              </div>

              <button
                type="button"
                className="team-btn team-btn-close"
                onClick={() =>
                  setSelectedTeam(
                    null
                  )
                }
              >
                Close
              </button>

            </div>

            {/* OWNER */}

            <p className="team-owner">

              <strong>
                Team Owner:
              </strong>{" "}

              {selectedTeam.ownerEmail}

            </p>

            {/* ================================================= */}
            {/* ADD MEMBER */}
            {/* ================================================= */}

            {canManageMembers(
              currentUserRole
            ) &&
              canManageSelectedTeam(
                selectedTeam
              ) && (

                <form
                  onSubmit={
                    handleAddMember
                  }
                  className="team-add-member-form"
                >

                  <input
                    type="email"
                    value={
                      memberEmail
                    }
                    onChange={(e) =>
                      setMemberEmail(
                        e.target.value
                      )
                    }
                    placeholder="Enter registered user's email"
                    aria-label="Member email"
                    required
                  />

                  <button
                    type="submit"
                    className="team-btn team-btn-success"
                    disabled={saving}
                  >
                    {saving
                      ? "Adding..."
                      : "Add Member"}
                  </button>

                </form>

              )}

            {/* ================================================= */}
            {/* MEMBERS */}
            {/* ================================================= */}

            <h3 className="team-members-title">

              Team Members (
              {selectedTeam
                .memberEmails
                ?.length || 0}
              )

            </h3>

            {selectedTeam
              .memberEmails
              ?.length ? (

              <div className="team-members-list">

                {selectedTeam.memberEmails.map(
                  (email) => (

                    <div
                      className="team-member-row"
                      key={email}
                    >

                      <span className="team-member-email">
                        {email}
                      </span>

                      {/* REMOVE MEMBER */}

                      {canManageMembers(
                        currentUserRole
                      ) &&
                        canManageSelectedTeam(
                          selectedTeam
                        ) && (

                          <button
                            type="button"
                            className="team-btn team-btn-danger"
                            onClick={() =>
                              handleRemoveMember(
                                email
                              )
                            }
                            disabled={saving}
                          >
                            Remove
                          </button>

                        )}

                    </div>

                  )
                )}

              </div>

            ) : (

              <p className="team-no-members">
                No members added to this
                team yet.
              </p>

            )}

          </section>

        )}

      </div>

    </div>
  )  
}

export default Team  