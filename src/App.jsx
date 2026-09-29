import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";

import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Team from "./pages/Team";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import Notifications from "./pages/Notifications";
import Activities from "./pages/Activities";
import AdminUsers from "./pages/AdminUser";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Projects List */}
          <Route path="/projects" element={<Projects />} />

          {/* Individual Project Details */}
          <Route
            path="/projects/:id"
            element={<ProjectDetails />}
          />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/team" element={<Team />} />
          <Route path="/notifications" element={<Notifications />}/>
          <Route path="/activities" element={<Activities />}/>
          <Route path="/admin/users"element={<AdminUsers />}/>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;