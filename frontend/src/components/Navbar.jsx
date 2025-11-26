import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold" onClick={closeMobileMenu}>
            📞 Phonebook
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
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
                <span className="text-sm truncate max-w-[150px]">
                  {user?.email}
                </span>
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block py-2 px-4 hover:bg-indigo-700 rounded"
              onClick={closeMobileMenu}
            >
              All Contacts
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  className="block py-2 px-4 hover:bg-indigo-700 rounded"
                  onClick={closeMobileMenu}
                >
                  Favorites
                </Link>
                <Link
                  to="/add-contact"
                  className="block py-2 px-4 hover:bg-indigo-700 rounded"
                  onClick={closeMobileMenu}
                >
                  Add Contact
                </Link>
                <div className="py-2 px-4 text-sm text-indigo-200">
                  {user?.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 px-4 bg-indigo-700 hover:bg-indigo-800 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 px-4 hover:bg-indigo-700 rounded"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 px-4 bg-indigo-700 hover:bg-indigo-800 rounded"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
