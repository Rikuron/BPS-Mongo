# BPS-Mongo Application

## Overview

This repository contains a full-stack application with separate backend and frontend projects.

- **Backend**: A Node.js and Express server with MongoDB for data storage. It provides RESTful API endpoints for managing residents, announcements, cases, events, staff, activities, and authentication.
- **Frontend**: A React application built with Vite, providing the user interface for interacting with the backend services.

---

## Folder Structure

- `backend/`: Contains the backend server code, including routes, controllers, models, middleware, configuration, and utilities.
- `frontend/`: Contains the frontend React application source code, public assets, and configuration files.

---

## Backend

### Technologies Used

- Node.js
- Express
- MongoDB with Mongoose
- Authentication with JSON Web Tokens (JWT)
- Nodemailer for email sending
- Middleware for security (Helmet), logging (Morgan), CORS, and file uploads (Multer)
- Environment variables managed with dotenv

### Setup and Running

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` directory with the following variables (example):

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ADMIN_KEY=your_admin_key_for_seeding_admin_user
   EMAIL_USER=your_email_address_for_sending_emails
   EMAIL_PASS=your_email_password_or_app_password
   ADMIN_EMAIL=your_admin_email_address_for_receiving_contact_form_submissions
   NODE_ENV=development
   ```

4. Start the backend server:

   ```bash
   npm start
   ```

5. The server will run on the port specified in `.env` (default 5000). API endpoints are available at:

   ```
   http://localhost:<PORT>/api
   ```

### API Endpoints Overview

- `/api/auth` - Authentication routes (login, register, etc.)
- `/api/residents` - Resident management
- `/api/announcements` - Announcements management
- `/api/cases` - Case management
- `/api/events` - Events calendar
- `/api/staff` - Staff management
- `/api/activities` - Activity tracking
- `/api/send-email` - Handles sending emails from the contact form

Health check endpoint:

```
GET /api/health
```

---

## Frontend

### Technologies Used

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios for API requests
- Various React libraries for charts, QR codes, icons, etc.

### Setup and Running

1. Navigate to the frontend directory:

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

4. The frontend will be available at:

   ```
   http://localhost:5173 (default of vite)
   ```

---

## Environment Variables

- Backend uses a `.env` file for configuration (MongoDB URI, JWT secret, port, email credentials, etc.).
- Frontend configuration can be found in `frontend/src/config/api.js` for API base URLs. The contact form uses the `/api/send-email` endpoint.

---

## License

This project is licensed under the ISC License.

---

## Contact

For questions or support, please contact the project maintainer.
