import { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  getAllTasks,
  getAllProjects,
  getMyTeams,
  createTask,
  updateTask,
  deleteTask,
} from "../services/api";

import {
  canCreateTask,
  canEditTask,
  canDeleteTask,
  canAssignTask,
} from "../utils/permission";

const initialForm = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
  projectId: "",
  teamId: "",
  assignedToId: "",
};

function Tasks() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        taskRes,
        projectRes,
        teamRes,
      ] = await Promise.all([
        getAllTasks(),
        getAllProjects(),
        getMyTeams(),
      ]);

      setTasks(
        Array.isArray(taskRes.data)
          ? taskRes.data
          : []
      );

      setProjects(
        Array.isArray(projectRes.data)
          ? projectRes.data
          : []
      );

      setTeams(
        Array.isArray(teamRes.data)
          ? teamRes.data
          : []
      );
    } catch (err) {
      console.error(
        "Error loading task data:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to load tasks. Please check the backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // Reset assignee when team changes
      if (name === "teamId") {
        updated.assignedToId = "";
      }

      return updated;
    });
  };

  // =====================================================
  // SELECTED TEAM
  // =====================================================

  const selectedTeam = teams.find(
    (team) =>
      String(team.id) ===
      String(form.teamId)
  );

  const teamMembers =
    selectedTeam?.members || [];

  // =====================================================
  // CREATE FORM
  // =====================================================

  const handleAddNew = () => {
    setForm(initialForm);
    setEditingId(null);
    setMessage("");
    setError("");
    setShowForm(true);
  };

  // =====================================================
  // EDIT TASK
  // =====================================================

  const handleEdit = (task) => {
    if (!canEditTask()) {
      setError(
        "You do not have permission to edit tasks."
      );
      return;
    }

    setForm({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "TODO",
      priority: task.priority || "MEDIUM",
      dueDate: task.dueDate || "",
      projectId: task.projectId
        ? String(task.projectId)
        : "",
      teamId: task.teamId
        ? String(task.teamId)
        : "",
      assignedToId: task.assignedToId
        ? String(task.assignedToId)
        : "",
    });

    setEditingId(task.id);
    setShowForm(true);

    setMessage("");
    setError("");
  };

  // =====================================================
  // VIEW TASK
  // =====================================================

  const handleView = (task) => {
    navigate(`/tasks/${task.id}`);
  };

  // =====================================================
  // OPEN EDIT FROM DETAILS PAGE
  // =====================================================

  useEffect(() => {
    const editTaskId =
      location.state?.editTaskId;

    if (
      !editTaskId ||
      tasks.length === 0
    ) {
      return;
    }

    const selectedTask = tasks.find(
      (task) =>
        String(task.id) ===
        String(editTaskId)
    );

    if (selectedTask) {
      handleEdit(selectedTask);

      navigate("/tasks", {
        replace: true,
        state: null,
      });
    }
  }, [
    location.state,
    tasks,
  ]);

  // =====================================================
  // CANCEL FORM
  // =====================================================

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);

    setError("");
    setMessage("");
  };

  // =====================================================
  // CREATE / UPDATE TASK
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    if (
      !editingId &&
      !canCreateTask()
    ) {
      setError(
        "You do not have permission to create tasks."
      );

      setSaving(false);
      return;
    }

    if (
      editingId &&
      !canEditTask()
    ) {
      setError(
        "You do not have permission to edit tasks."
      );

      setSaving(false);
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,

      projectId: form.projectId
        ? Number(form.projectId)
        : null,

      teamId: form.teamId
        ? Number(form.teamId)
        : null,

      assignedToId:
        canAssignTask() &&
        form.assignedToId
          ? Number(form.assignedToId)
          : null,
    };

    try {
      if (editingId) {
        await updateTask(
          editingId,
          payload
        );

        setMessage(
          "Task updated successfully!"
        );
      } else {
        await createTask(payload);

        setMessage(
          "Task created successfully!"
        );
      }

      setShowForm(false);
      setEditingId(null);
      setForm(initialForm);

      await loadData();
    } catch (err) {
      console.error(
        "Error saving task:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to save task. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE TASK
  // =====================================================

  const handleDelete = async (id) => {
    if (!canDeleteTask()) {
      setError(
        "You do not have permission to delete tasks."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError("");
    setMessage("");

    try {
      await deleteTask(id);

      setMessage(
        "Task deleted successfully!"
      );

      setTasks((prevTasks) =>
        prevTasks.filter(
          (task) => task.id !== id
        )
      );

      await loadData();
    } catch (err) {
      console.error(
        "Error deleting task:",
        err
      );

      if (err.response?.status === 403) {
        setError(
          "403 Forbidden: You do not have permission to delete this task."
        );
      } else if (
        err.response?.status === 401
      ) {
        setError(
          "401 Unauthorized: Please login again."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data ||
            "Unable to delete task. Please try again."
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredTasks = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return tasks.filter((task) => {
      const searchableText = [
        task.title,
        task.description,
        task.projectName,
        task.teamName,
        task.assignedToName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchableText.includes(
          searchText
        );

      const matchesStatus =
        statusFilter === "ALL" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        task.priority ===
          priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    tasks,
    search,
    statusFilter,
    priorityFilter,
  ]);

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
  };

  const hasActiveFilters =
    search !== "" ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL";

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "TODO":
        return "status-todo";

      case "IN_PROGRESS":
        return "status-progress";

      case "COMPLETED":
        return "status-completed";

      default:
        return "";
    }
  };

  // =====================================================
  // PRIORITY CLASS
  // =====================================================

  const getPriorityClass = (
    priority
  ) => {
    switch (priority) {
      case "LOW":
        return "priority-low";

      case "MEDIUM":
        return "priority-medium";

      case "HIGH":
        return "priority-high";

      default:
        return "";
    }
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="tasks-page">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="tasks-header">

        <div>
          <h1>Task Management</h1>

          <p>
            Manage and track your
            project tasks.
          </p>
        </div>

        {canCreateTask() && (
          <button
            className="task-primary-btn"
            onClick={handleAddNew}
          >
            + Create Task
          </button>
        )}

      </div>

      {/* ================================================= */}
      {/* MESSAGES */}
      {/* ================================================= */}

      {message && (
        <div className="task-success">
          {message}
        </div>
      )}

      {error && (
        <div className="task-error">
          {String(error)}
        </div>
      )}

      {/* ================================================= */}
      {/* CREATE / EDIT FORM */}
      {/* ================================================= */}

      {showForm && (
        <div className="task-form-card">

          <h2>
            {editingId
              ? "Edit Task"
              : "Create New Task"}
          </h2>

          <form
            onSubmit={handleSubmit}
          >

            <div className="task-form-grid">

              {/* TITLE */}

              <div className="task-form-group">

                <label>
                  Task Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={
                    handleChange
                  }
                  placeholder="Enter task title"
                  required
                />

              </div>

              {/* PROJECT */}

              <div className="task-form-group">

                <label>
                  Project
                </label>

                <select
                  name="projectId"
                  value={form.projectId}
                  onChange={
                    handleChange
                  }
                >

                  <option value="">
                    Select Project
                  </option>

                  {projects.map(
                    (project) => (
                      <option
                        key={project.id}
                        value={project.id}
                      >
                        {project.name}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* TEAM */}

              <div className="task-form-group">

                <label>
                  Team
                </label>

                <select
                  name="teamId"
                  value={form.teamId}
                  onChange={
                    handleChange
                  }
                >

                  <option value="">
                    Select Team
                  </option>

                  {teams.map(
                    (team) => (
                      <option
                        key={team.id}
                        value={team.id}
                      >
                        {team.name}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* ASSIGNEE */}

              {canAssignTask() && (
                <div className="task-form-group">

                  <label>
                    Assign To
                  </label>

                  <select
                    name="assignedToId"
                    value={
                      form.assignedToId
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !form.teamId
                    }
                  >

                    <option value="">
                      {form.teamId
                        ? "Select Team Member"
                        : "Select Team First"}
                    </option>

                    {teamMembers.map(
                      (member) => (
                        <option
                          key={member.id}
                          value={member.id}
                        >
                          {member.fullName} (
                          {member.email})
                        </option>
                      )
                    )}

                  </select>

                </div>
              )}

              {/* STATUS */}

              <div className="task-form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={
                    handleChange
                  }
                >

                  <option value="TODO">
                    To Do
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                </select>

              </div>

              {/* PRIORITY */}

              <div className="task-form-group">

                <label>
                  Priority
                </label>

                <select
                  name="priority"
                  value={
                    form.priority
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="LOW">
                    Low
                  </option>

                  <option value="MEDIUM">
                    Medium
                  </option>

                  <option value="HIGH">
                    High
                  </option>

                </select>

              </div>

              {/* DUE DATE */}

              <div className="task-form-group">

                <label>
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={
                    form.dueDate
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              {/* DESCRIPTION */}

              <div className="task-form-group task-full-width">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter task description"
                  rows="4"
                />

              </div>

            </div>

            {/* FORM ACTIONS */}

            <div className="task-form-actions">

              <button
                type="button"
                className="task-secondary-btn"
                onClick={
                  handleCancel
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="task-primary-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Task"
                  : "Create Task"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* ================================================= */}
      {/* TASK COUNT */}
      {/* ================================================= */}

      <div className="task-count-card">

        <h3>
          Total Tasks: {tasks.length}
        </h3>

      </div>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <div className="task-filter-card">

        <div className="task-filter-header">

          <div>

            <h2>
              Search & Filters
            </h2>

            <p>
              Find tasks by keyword,
              status, or priority.
            </p>

          </div>

          <button
            type="button"
            className="task-secondary-btn"
            onClick={
              clearFilters
            }
            disabled={
              !hasActiveFilters
            }
          >
            Clear Filters
          </button>

        </div>

        <div className="task-filter-grid">

          {/* SEARCH */}

          <div className="task-form-group">

            <label>
              Search Tasks
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search title, project, team, assignee..."
            />

          </div>

          {/* STATUS */}

          <div className="task-form-group">

            <label>
              Filter by Status
            </label>

            <select
              value={
                statusFilter
              }
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >

              <option value="ALL">
                All Statuses
              </option>

              <option value="TODO">
                To Do
              </option>

              <option value="IN_PROGRESS">
                In Progress
              </option>

              <option value="COMPLETED">
                Completed
              </option>

            </select>

          </div>

          {/* PRIORITY */}

          <div className="task-form-group">

            <label>
              Filter by Priority
            </label>

            <select
              value={
                priorityFilter
              }
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value
                )
              }
            >

              <option value="ALL">
                All Priorities
              </option>

              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>

            </select>

          </div>

        </div>

        <div className="task-filter-result">

          Showing{" "}
          <strong>
            {filteredTasks.length}
          </strong>{" "}
          of{" "}
          <strong>
            {tasks.length}
          </strong>{" "}
          tasks

        </div>

      </div>

      {/* ================================================= */}
      {/* TASK TABLE */}
      {/* ================================================= */}

      <div className="task-table-card">

        <div className="task-table-heading">

          <h2>
            Tasks
          </h2>

        </div>

        {loading ? (

          <p className="task-loading">
            Loading tasks...
          </p>

        ) : filteredTasks.length > 0 ? (

          <div className="task-table-wrapper">

            <table className="task-table">

              <thead>

                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Team</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredTasks.map(
                  (task) => (

                    <tr key={task.id}>

                      <td>

                        <strong>
                          {task.title}
                        </strong>

                        <p className="task-description">
                          {task.description ||
                            "No description"}
                        </p>

                      </td>

                      <td>
                        {task.projectName ||
                          "—"}
                      </td>

                      <td>
                        {task.teamName ||
                          "—"}
                      </td>

                      <td>
                        {task.assignedToName ||
                          "Unassigned"}
                      </td>

                      <td>

                        <span
                          className={`task-badge ${getStatusClass(
                            task.status
                          )}`}
                        >
                          {task.status?.replace(
                            "_",
                            " "
                          ) || "—"}
                        </span>

                      </td>

                      <td>

                        <span
                          className={`task-badge ${getPriorityClass(
                            task.priority
                          )}`}
                        >
                          {task.priority ||
                            "—"}
                        </span>

                      </td>

                      <td>
                        {task.dueDate ||
                          "—"}
                      </td>

                      <td>

                        <div className="task-actions">

                          {/* VIEW */}

                          <button
                            type="button"
                            className="task-view-btn"
                            onClick={() =>
                              handleView(
                                task
                              )
                            }
                          >
                            View
                          </button>

                          {/* EDIT */}

                          {canEditTask() && (
                            <button
                              type="button"
                              className="task-edit-btn"
                              onClick={() =>
                                handleEdit(
                                  task
                                )
                              }
                              disabled={
                                deletingId ===
                                task.id
                              }
                            >
                              Edit
                            </button>
                          )}

                          {/* DELETE */}

                          {canDeleteTask() && (
                            <button
                              type="button"
                              className="task-delete-btn"
                              onClick={() =>
                                handleDelete(
                                  task.id
                                )
                              }
                              disabled={
                                deletingId ===
                                task.id
                              }
                            >
                              {deletingId ===
                              task.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="task-empty-state">

            <h3>

              {tasks.length === 0
                ? "No tasks available"
                : "No matching tasks found"}

            </h3>

            <p>

              {tasks.length === 0
                ? "Create your first task to get started."
                : "Try changing your search or filter options."}

            </p>

            {hasActiveFilters && (

              <button
                className="task-secondary-btn"
                onClick={
                  clearFilters
                }
              >
                Clear Filters
              </button>

            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Tasks;