import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import GuestPage from "./pages/GuestPage";
import UsersPage from "./pages/UsersPage";
import UserPage from "./pages/UserPage";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoutes />}>
            <Route index element={<HomePage />} />
            <Route path="/rooms/create" element={<RoomPage />} />
            <Route path="/rooms/:id/edit" element={<RoomPage />} />
            <Route path="/rooms/:id" element={<GuestPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/create" element={<UserPage />} />
            <Route path="/users/:profile" element={<UserPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
