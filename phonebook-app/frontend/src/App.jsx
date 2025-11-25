import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ContactList from "./pages/ContactList";
import AddContact from "./pages/AddContact";
import EditContact from "./pages/EditContact";
import Favorites from "./pages/Favorites";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<ContactList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/add-contact"
              element={
                <PrivateRoute>
                  <AddContact />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-contact/:id"
              element={
                <PrivateRoute>
                  <EditContact />
                </PrivateRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <Favorites />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
