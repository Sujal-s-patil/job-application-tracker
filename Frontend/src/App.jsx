import { Navigate, Route, Routes } from 'react-router-dom'
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Add from "./pages/Add";
import Update from "./pages/Update"
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import { NotificationProvider } from "./components/notifications/NotificationProvider";

function App() {
  return (
    <NotificationProvider>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<Add />} />
          <Route path="/update/:id" element={<Update />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NotificationProvider>
  )
}


export default App
