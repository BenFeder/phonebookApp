import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? "https://phonebookapp.holh.onrender.com/api" 
    : "/api");

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (email, password) =>
    api.post("/auth/register", { email, password }),
  login: (email, password) => api.post("/auth/login", { email, password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  getCurrentUser: () => api.get("/auth/me"),
};

// Contacts API
export const contactsAPI = {
  getContacts: (page = 1, limit = 10, search = "") =>
    api.get("/contacts", { params: { page, limit, search } }),
  getContact: (id) => api.get(`/contacts/${id}`),
  createContact: (contactData) => api.post("/contacts", contactData),
  updateContact: (id, contactData) => api.put(`/contacts/${id}`, contactData),
  deleteContact: (id) => api.delete(`/contacts/${id}`),
};

// Favorites API
export const favoritesAPI = {
  getFavorites: () => api.get("/favorites"),
  addToFavorites: (contactId) => api.post(`/favorites/${contactId}`),
  removeFromFavorites: (contactId) => api.delete(`/favorites/${contactId}`),
};

export default api;
