
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTaskById,
  getTaskComments,
  addTaskComment,
} from "../services/api";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Task comments state
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState("");

  // Fetch task details
  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getTaskById(id);
        setTask(response.data);
      } catch (err) {
        console.error("Error loading task details:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load task details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // Fetch comments for this task
  const fetchComments = async () => {
    setCommentsLoading(true);
    setCommentsError("");

    try {
      const response = await getTaskComments(id);
      setComments(response.data);
    } catch (err) {
      console.error("Error loading comments:", err);
      setCommentsError(
        err.response?.data?.message ||
          "Failed to load comments."
      );
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  // Submit a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    const content = newComment.trim();

    if (!content) {
      setCommentsError("Please enter a comment.");
      return;
    }

    setCommentSubmitting(true);
    setCommentsError("");
    setCommentSuccess("");

    try {
      await addTaskComment(id, content);

      setNewComment("");
      setCommentSuccess("Comment added successfully!");

      // Reload comments to display the saved comment
      await fetchComments();
    } catch (err) {
      console.error("Error adding comment:", err);
      setCommentsError(
        err.response?.data?.message ||
          "Failed to add comment. Please try again."
      );
    } finally {
      setCommentSubmitting(false);
    }
  };

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

  const getPriorityClass = (priority) => {
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

  const formatCommentDate = (dateTime) => {
    if (!dateTime) return "";

    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) return dateTime;

    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="task-details-page">
        <p className="task-details-message">
          Loading task details...
        </p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="task-details-page">
        <div className="task-details-error">
          {error || "Task not found."}
        </div>

        <button
          className="task-details-back-btn"
          onClick={() => navigate("/tasks")}
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="task-details-page">
      <div className="task-details-header">
        <div>
          <button
            className="task-details-back-btn"
            onClick={() => navigate("/tasks")}
          >
            ← Back to Tasks
          </button>

          <h1>Task Details</h1>
          <p>View complete information about this task.</p>
        </div>

        <button
          className="task-details-edit-btn"
          onClick={() =>
            navigate("/tasks", {
              state: { editTaskId: task.id },
            })
          }
        >
          Edit Task
        </button>
      </div>

      {/* Existing Task Details */}
      <div className="task-details-card">
        <div className="task-details-title-row">
          <div>
            <span className="task-details-label">
              TASK TITLE
            </span>
            <h2>{task.title}</h2>
          </div>

          <span
            className={`task-details-badge ${getStatusClass(
              task.status
            )}`}
          >
            {task.status?.replace("_", " ") || "—"}
          </span>
        </div>

        <div className="task-details-description">
          <h3>Description</h3>
          <p>{task.description || "No description provided."}</p>
        </div>

        <div className="task-details-grid">
          <div className="task-details-item">
            <span className="task-details-label">Priority : </span>
            <span
              className={`task-details-badge ${getPriorityClass(
                task.priority
              )}`}
            >
              {task.priority || "—"}
            </span>
          </div>

          <div className="task-details-item">
            <span className="task-details-label">Due Date : </span>
            <strong>{task.dueDate || "Not set"}</strong>
          </div>

          <div className="task-details-item">
            <span className="task-details-label">Project : </span>
            <strong>
              {task.projectName || "No project assigned"}
            </strong>
          </div>

          <div className="task-details-item">
            <span className="task-details-label">Team : </span>
            <strong>{task.teamName || "No team assigned"}</strong>
          </div>

          <div className="task-details-item">
            <span className="task-details-label">
              Assigned To :
            </span>
            <strong>{task.assignedToName || "Unassigned"}</strong>
          </div>

          <div className="task-details-item">
            <span className="task-details-label">Task ID : </span>
            <strong>#{task.id}</strong>
          </div>
        </div>
      </div>

      {/* Task Comments Section */}
      <div className="task-comments-section">
        <h2>Task Comments</h2>
        <p className="task-comments-subtitle">
          Share updates and discuss this task with your team.
        </p>

        {/* Add Comment Form */}
        <form
          className="task-comment-form"
          onSubmit={handleAddComment}
        >
          <textarea
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              setCommentSuccess("");
            }}
            placeholder="Write your comment here..."
            rows={4}
            maxLength={2000}
            disabled={commentSubmitting}
          />

          <div className="task-comment-form-footer">
            <span>{newComment.length}/2000</span>

            <button
              type="submit"
              disabled={
                commentSubmitting || !newComment.trim()
              }
            >
              {commentSubmitting
                ? "Posting..."
                : "Add Comment"}
            </button>
          </div>
        </form>

        {commentsError && (
          <div className="task-comments-error">
            {commentsError}
          </div>
        )}

        {commentSuccess && (
          <div className="task-comments-success">
            {commentSuccess}
          </div>
        )}

        {/* Comments List */}
        <div className="task-comments-list">
          <h3>All Comments ({comments.length})</h3>

          {commentsLoading ? (
            <p>Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="task-comments-empty">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                className="task-comment-item"
                key={comment.id}
              >
                <div className="task-comment-item-header">
                  <strong>
                    {comment.authorName || "Unknown User"}
                  </strong>

                  <span>
                    {formatCommentDate(comment.createdAt)}
                  </span>
                </div>

                <p>{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;