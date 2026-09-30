import axios from "axios";

// AXIOS INSTANCE

const api = axios.create({
  baseURL: "https://workflowpro-1axf.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT TOKEN INTERCEPTOR

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

// AUTH / ROLE HELPERS

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

// AUTHENTICATION APIs

export const registerUser = (userData) => {
  return api.post("/api/auth/register", userData);
};

export const loginUser = async (loginData) => {
  const response = await api.post("/api/auth/login", loginData);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

// PROJECT APIs

export const getAllProjects = () => {
  return api.get("/api/projects");
};

export const getProjectById = (id) => {
  return api.get(`/api/projects/${id}`);
};

export const createProject = (projectData) => {
  return api.post("/api/projects", projectData);
};

export const updateProject = (id, projectData) => {
  return api.put(`/api/projects/${id}`, projectData);
};

export const deleteProject = (id) => {
  return api.delete(`/api/projects/${id}`);
};

// TEAM APIs

export const getMyTeams = () => {
  return api.get("/api/teams");
};

export const getTeamById = (id) => {
  return api.get(`/api/teams/${id}`);
};

export const createTeam = (teamData) => {
  return api.post("/api/teams", teamData);
};

export const addTeamMember = (teamId, email) => {
  return api.post(`/api/teams/${teamId}/members`, {
    email,
  });
};

export const removeTeamMember = (teamId, email) => {
  return api.delete(`/api/teams/${teamId}/members`, {
    params: {
      email,
    },
  });
};

export const deleteTeam = (teamId) => {
  return api.delete(`/api/teams/${teamId}`);
};

// TASK APIs

export const getAllTasks = () => {
  return api.get("/api/tasks");
};

export const getTaskById = (id) => {
  return api.get(`/api/tasks/${id}`);
};

export const createTask = (taskData) => {
  return api.post("/api/tasks", taskData);
};

export const updateTask = (id, taskData) => {
  return api.put(`/api/tasks/${id}`, taskData);
};

export const deleteTask = (id) => {
  return api.delete(`/api/tasks/${id}`);
};

// TASK COMMENT APIs

export const getTaskComments = (taskId) => {
  return api.get(`/api/tasks/${taskId}/comments`);
};

export const addTaskComment = (taskId, content) => {
  return api.post(`/api/tasks/${taskId}/comments`, {
    content,
  });
};

// NOTIFICATION APIs

export const getNotifications = () => {
  return api.get("/api/notifications");
};

export const getUnreadNotificationCount = () => {
  return api.get("/api/notifications/unread-count");
};

export const markNotificationAsRead = (notificationId) => {
  return api.put(`/api/notifications/${notificationId}/read`);
};

export const markAllNotificationsAsRead = () => {
  return api.put("/api/notifications/read-all");
};

export const deleteNotification = (notificationId) => {
  return api.delete(`/api/notifications/${notificationId}`);
};

// ACTIVITY APIs

export const getAllActivities = () => {
  return api.get("/api/activities");
};

export const getMyActivities = () => {
  return api.get("/api/activities/my");
};

// DASHBOARD APIs

export const getDashboardStats = () => {
  return api.get("/api/dashboard/stats");
};

// ADMIN APIs

export const getAdminUsers = () => {
  return api.get("/api/admin/users");
};

export const changeUserRole = (userId, role) => {
  return api.put(`/api/admin/users/${userId}/role`, {
    role,
  });
};

export const deleteAdminUser = (userId) => {
  return api.delete(`/api/admin/users/${userId}`);
};

export default api;
