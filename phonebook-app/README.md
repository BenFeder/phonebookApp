# Phonebook Application

A full-stack phonebook application built with React (Vite + Tailwind CSS) frontend and Express/Node.js backend with MongoDB.

## Features

### User Authentication

- ✅ User registration with email and password
- ✅ Email verification after registration
- ✅ JWT-based authentication
- ✅ Protected routes for authenticated users

### Contact Management

- ✅ View all contacts with pagination (10 per page)
- ✅ Search contacts by name or phone number
- ✅ Contacts sorted by last name, then first name
- ✅ Add new contacts (authenticated users only)
- ✅ Update contacts (only your own contacts)
- ✅ Delete contacts (only your own contacts)
- ✅ Contact fields: First Name, Last Name, Phone, Street Address, City, State, Zip Code

### Favorites System

- ✅ Add contacts to your favorites list (click the "+" button)
- ✅ View all your favorite contacts
- ✅ Remove contacts from favorites (click the "★" button)
- ✅ Must be logged in to use favorites

## Tech Stack

### Frontend

- **React 18** with Vite
- **React Router DOM** for routing
- **Tailwind CSS** for styling
- **Axios** for API calls
- **useState & useEffect** for state management

### Backend

- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Nodemailer** for email verification
- **Express Validator** for input validation

## Project Structure

```
phonebook-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # User model
│   │   └── Contact.js            # Contact model
│   ├── routes/
│   │   ├── auth.js               # Auth routes (register, login, verify)
│   │   ├── contacts.js           # Contact CRUD routes
│   │   └── favorites.js          # Favorites routes
│   ├── utils/
│   │   └── email.js              # Email sending utility
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── server.js                 # Express server
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation bar
    │   │   └── PrivateRoute.jsx  # Protected route wrapper
    │   ├── context/
    │   │   └── AuthContext.jsx   # Authentication context
    │   ├── pages/
    │   │   ├── Register.jsx      # Registration page
    │   │   ├── Login.jsx         # Login page
    │   │   ├── ContactList.jsx   # All contacts with pagination
    │   │   ├── AddContact.jsx    # Add contact form
    │   │   ├── EditContact.jsx   # Edit/delete contact
    │   │   ├── Favorites.jsx     # Favorite contacts list
    │   │   └── VerifyEmail.jsx   # Email verification page
    │   ├── services/
    │   │   └── api.js            # API service layer
    │   ├── App.jsx               # Main app component
    │   ├── main.jsx              # Entry point
    │   └── index.css             # Tailwind CSS imports
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Gmail account (for email verification)

### Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/phonebook
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@phonebook.com
CLIENT_URL=http://localhost:5173
```

**Note:** For Gmail, you need to generate an [App Password](https://support.google.com/accounts/answer/185833) instead of using your regular password.

5. Start MongoDB (if running locally):

```bash
mongod
```

6. Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email/:token` - Verify email
- `GET /api/auth/me` - Get current user (protected)

### Contacts

- `GET /api/contacts` - Get all contacts (pagination & search)
- `GET /api/contacts/:id` - Get single contact
- `POST /api/contacts` - Create contact (protected)
- `PUT /api/contacts/:id` - Update contact (protected, owner only)
- `DELETE /api/contacts/:id` - Delete contact (protected, owner only)

### Favorites

- `GET /api/favorites` - Get user's favorites (protected)
- `POST /api/favorites/:contactId` - Add to favorites (protected)
- `DELETE /api/favorites/:contactId` - Remove from favorites (protected)

## Usage

1. **Register an Account:**

   - Go to the Register page
   - Enter email and password (min 6 characters)
   - Check your email for verification link

2. **Verify Email:**

   - Click the link in the verification email
   - You'll be redirected to login

3. **Login:**

   - Use your verified email and password
   - You'll be redirected to the contact list

4. **Browse Contacts:**

   - Anyone can view all contacts
   - Use the search bar to find specific contacts
   - Navigate through pages (10 contacts per page)

5. **Add Contact:**

   - Must be logged in
   - Click "Add Contact" in the navbar
   - Fill in all required fields
   - Submit the form

6. **Manage Favorites:**

   - Must be logged in
   - Click the "+" button next to any contact to add to favorites
   - View favorites from the "Favorites" link in navbar
   - Click the "★" to remove from favorites

7. **Edit/Delete Contacts:**
   - Must be logged in
   - Can only edit/delete your own contacts
   - Click "Edit" on a contact you created
   - Update fields or click "Delete" to remove

## Security Features

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Protected routes (authentication required)
- ✅ Authorization checks (users can only modify their own contacts)
- ✅ Input validation on backend
- ✅ Email verification for new accounts

## Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development

```bash
cd frontend
npm run dev  # Uses Vite with HMR
```

### Build for Production

Frontend:

```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

## License

ISC

## Author

Created for the Phonebook App project
