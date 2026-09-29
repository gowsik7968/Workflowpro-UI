import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "https://workflowpro-1axf.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
// ==============================
// AUTH / ROLE HELPERS
// ==============================

export const getCurrentUserFromToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return {
      email: payload.sub || null,
      role: payload.role || null,
    };
  } catch (error) {
    console.error("Failed to read JWT:", error);
    return null;
  }
};

export const getCurrentUserRole = () => {
  const user = getCurrentUserFromToken();
  return user?.role || null;
};

export const getCurrentUserEmail = () => {
  const user = getCurrentUserFromToken();
  return user?.email || null;
};
// ==============================
// AUTHENTICATION APIs
// ==============================

export const registerUser = (userData) => {
  return api.post("/auth/register", userData);
};

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

// ==============================
// PROJECT APIs
// ==============================

export const getAllProjects = () => {
  return api.get("/projects");
};

export const getProjectById = (id) => {
  return api.get(`/projects/${id}`);
};

export const createProject = (projectData) => {
  return api.post("/projects", projectData);
};

export const updateProject = (id, projectData) => {
  return api.put(`/projects/${id}`, projectData);
};

export const deleteProject = (id) => {
  return api.delete(`/projects/${id}`);
};

// ==============================
// TEAM APIs
// ==============================

export const getMyTeams = () => {
  return api.get("/teams");
};

export const getTeamById = (id) => {
  return api.get(`/teams/${id}`);
};

export const createTeam = (teamData) => {
  return api.post("/teams", teamData);
};

export const addTeamMember = (teamId, email) => {
  return api.post(`/teams/${teamId}/members`, {
    email,
  });
};

export const removeTeamMember = (teamId, email) => {
  return api.delete(`/teams/${teamId}/members`, {
    params: {
      email,
    },
  });
};

export const deleteTeam = (teamId) => {
  return api.delete(`/teams/${teamId}`);
};

// ==============================
// TASK APIs
// ==============================

export const getAllTasks = () => {
  return api.get("/tasks");
};

export const getTaskById = (id) => {
  return api.get(`/tasks/${id}`);
};

export const createTask = (taskData) => {
  return api.post("/tasks", taskData);
};

export const updateTask = (id, taskData) => {
  return api.put(`/tasks/${id}`, taskData);
};

export const deleteTask = (id) => {
  return api.delete(`/tasks/${id}`);
};

// ==============================
// TASK COMMENT APIs
// ==============================

export const getTaskComments = (taskId) => {
  return api.get(`/tasks/${taskId}/comments`);
};

export const addTaskComment = (taskId, content) => {
  return api.post(`/tasks/${taskId}/comments`, {
    content,
  });
};

// ==============================
// NOTIFICATION APIs
// ==============================

export const getNotifications = () => {
  return api.get("/notifications");
};

export const getUnreadNotificationCount = () => {
  return api.get("/notifications/unread-count");
};

export const markNotificationAsRead = (notificationId) => {
  return api.put(`/notifications/${notificationId}/read`);
};

export const markAllNotificationsAsRead = () => {
  return api.put("/notifications/read-all");
};

export const deleteNotification = (notificationId) => {
  return api.delete(`/notifications/${notificationId}`);
};

// ==============================
// ACTIVITY APIs
// ==============================

export const getAllActivities = () => {
  return api.get("/activities");
};

export const getMyActivities = () => {
  return api.get("/activities/my");
};

// ==============================
// DASHBOARD APIs
// ==============================

export const getDashboardStats = () => {
  return api.get("/dashboard/stats");
};


// admin
export const getAdminUsers = () =>
  api.get("/admin/users");

export const changeUserRole = (userId, role) =>
  api.put(`/admin/users/${userId}/role`, { role });

export const deleteAdminUser = (userId) =>
  api.delete(`/admin/users/${userId}`);


// ==============================
// EXPORT
// ==============================

export default api; 
