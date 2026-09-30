// WorkFlowPro role permissions

export const ROLES = {
  USER: "USER",
  TEAM_LEAD: "TEAM_LEAD",
  MANAGER: "MANAGER",
  ADMIN: "ADMIN",
};

// Get current logged-in user's role

export const getCurrentUserRole = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    return payload.role || null;
  } catch (error) {
    console.error("Unable to read user role:", error);
    return null;
  }
};

// Check one role

export const hasRole = (role) => {
  const currentRole = getCurrentUserRole();

  return currentRole === role;
};

// Check multiple roles

export const hasAnyRole = (roles = []) => {
  const currentRole = getCurrentUserRole();

  return roles.includes(currentRole);
};

// ==========================================
// PROJECT PERMISSIONS
// ==========================================

export const canCreateProject = () => {
  return hasAnyRole([
    ROLES.MANAGER,
    ROLES.ADMIN,
  ]);
};

export const canEditProject = () => {
  return hasAnyRole([
    ROLES.MANAGER,
    ROLES.ADMIN,
  ]);
};

export const canDeleteProject = () => {
  return hasAnyRole([
    ROLES.MANAGER,
    ROLES.ADMIN,
  ]);
};

// ==========================================
// TASK PERMISSIONS
// ==========================================

export const canCreateTask = () => {
  return hasAnyRole([
    ROLES.USER,
    ROLES.TEAM_LEAD,
    ROLES.MANAGER,
    ROLES.ADMIN,
  ]);
};

export const canEditTask = () => {
  return hasAnyRole([
    ROLES.TEAM_LEAD,
    ROLES.MANAGER,
    ROLES.ADMIN,
  ]);
};

export const canDeleteTask = () => {
  return hasAnyRole([
    ROLES.TEAM_LEAD,
    ROLES.ADMIN,
  ]);
};

export const canAssignTask = () => {
  return hasAnyRole([
    ROLES.TEAM_LEAD,
    ROLES.MANAGER,
    ROLES.ADMIN,
  ]);
};

// ==========================================
// TEAM PERMISSIONS
// ==========================================

export const canCreateTeam = () => {
  return hasAnyRole([
    ROLES.TEAM_LEAD,
    ROLES.MANAGER,
    ROLES.ADMIN,
  ]);
};

export const canManageTeamMembers = () => {
  return hasAnyRole([
    ROLES.TEAM_LEAD,
    ROLES.MANAGER,
    ROLES.ADMIN,
  ]);
};

export const canDeleteOwnTeam = () => {
  return hasAnyRole([
    ROLES.TEAM_LEAD,
    ROLES.ADMIN,
  ]);
};

// ==========================================
// ADMIN PERMISSIONS
// ==========================================

export const canManageUsers = () => {
  return hasRole(ROLES.ADMIN);
};

export const canChangeUserRole = () => {
  return hasRole(ROLES.ADMIN);
};

export const canDeleteUser = () => {
  return hasRole(ROLES.ADMIN);
};

// ==========================================
// REPORT PERMISSIONS
// ==========================================

export const canViewReports = () => {
  return hasAnyRole([
    ROLES.TEAM_LEAD,
    ROLES.MANAGER,
    ROLES.ADMIN,
  ]);
};

// ==========================================
// SYSTEM SETTINGS
// ==========================================

export const canManageSettings = () => {
  return hasRole(ROLES.ADMIN);
};
