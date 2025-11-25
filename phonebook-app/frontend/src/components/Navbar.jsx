import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            📞 Phonebook
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-indigo-200">
              All Contacts
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/favorites" className="hover:text-indigo-200">
                  Favorites
                </Link>
                <Link to="/add-contact" className="hover:text-indigo-200">
                  Add Contact
                </Link>
                <span className="text-sm">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
