import { useState, useEffect } from "react";
import { favoritesAPI } from "../services/api";
import { Link } from "react-router-dom";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await favoritesAPI.getFavorites();
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (contactId) => {
    try {
      await favoritesAPI.removeFromFavorites(contactId);
      setFavorites(favorites.filter((contact) => contact._id !== contactId));
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Favorite Contacts</h1>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">You haven't added any favorites yet.</p>
          <Link to="/" className="text-indigo-600 hover:underline">
            Browse all contacts
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((contact) => (
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

                <button
                  onClick={() => handleRemoveFromFavorites(contact._id)}
                  className="text-2xl text-yellow-500 hover:text-gray-300"
                  title="Remove from favorites"
                >
                  ★
                </button>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>{contact.address.street}</p>
                <p>
                  {contact.address.city}, {contact.address.state}{" "}
                  {contact.address.zipCode}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
