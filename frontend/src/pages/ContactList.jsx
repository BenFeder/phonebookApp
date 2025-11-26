import { useState, useEffect, useContext } from "react";
import { contactsAPI, favoritesAPI } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    fetchContacts();
  }, [currentPage, search]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await contactsAPI.getContacts(currentPage, 10, search);
      setContacts(response.data.contacts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await favoritesAPI.getFavorites();
      setFavorites(response.data.map((f) => f._id));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleAddToFavorites = async (contactId) => {
    try {
      await favoritesAPI.addToFavorites(contactId);
      setFavorites([...favorites, contactId]);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      alert(error.response?.data?.message || "Failed to add to favorites");
    }
  };

  const handleRemoveFromFavorites = async (contactId) => {
    try {
      await favoritesAPI.removeFromFavorites(contactId);
      setFavorites(favorites.filter((id) => id !== contactId));
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const isFavorite = (contactId) => favorites.includes(contactId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Contacts</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No contacts found.{" "}
          {isAuthenticated && (
            <Link to="/add-contact" className="text-indigo-600 hover:underline">
              Add one now
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold">
                    {contact.lastName}, {contact.firstName}
                  </h3>
                  <p className="text-gray-600">{contact.phoneNumber}</p>
                </div>

                {isAuthenticated && (
                  <button
                    onClick={() =>
                      isFavorite(contact._id)
                        ? handleRemoveFromFavorites(contact._id)
                        : handleAddToFavorites(contact._id)
                    }
                    className={`text-2xl ${
                      isFavorite(contact._id)
                        ? "text-yellow-500"
                        : "text-gray-300 hover:text-yellow-500"
                    }`}
                    title={
                      isFavorite(contact._id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {isFavorite(contact._id) ? "★" : "+"}
                  </button>
                )}
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>{contact.address.street}</p>
                <p>
                  {contact.address.city}, {contact.address.state}{" "}
                  {contact.address.zipCode}
                </p>
              </div>

              {isAuthenticated &&
                user &&
                contact.createdBy &&
                (contact.createdBy._id === user._id ||
                  contact.createdBy._id === user.id) && (
                  <div className="mt-4 flex space-x-2">
                    <Link
                      to={`/edit-contact/${contact._id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700"
          >
            Previous
          </button>

          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactList;
