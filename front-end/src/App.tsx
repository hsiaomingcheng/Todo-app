import { Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import BoardsPage from "./pages/boards/BoardsPage";
// import BoardPage from "./pages/board/BoardPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected — wrapped in AppLayout (Navbar + main) */}
        <Route element={<ProtectedRoute />}> {/* gatekeeper */}
          <Route element={<AppLayout />}>
            <Route path="/boards" element={<BoardsPage />} />
            {/* <Route path="/boards/:boardId" element={<BoardPage />} /> */}
          </Route>
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/boards" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
