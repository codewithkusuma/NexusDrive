# NexusDrive 🚀

NexusDrive is a modern, full-stack cloud storage and file management system. It's designed to be clean, secure, and fast, built specifically for high-quality project demonstrations.

## Features
- **User Authentication**: Secure Register/Login with JWT.
- **File Management**: Upload, Rename, Delete, and Download files.
- **Organization**: Create and manage folders.
- **Sharing**: Generate unique shareable links for any file.
- **Responsive UI**: Beautiful dark-themed interface using React and modern CSS.
- **Drag & Drop**: Effortless file uploads.

## Tech Stack
- **Frontend**: React.js (Vite), Lucide Icons
- **Backend**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Local Disk Storage (Multer)

## Prerequisites
- **Node.js**: Installed on your system.
- **MongoDB**: A local instance running on `mongodb://127.0.0.1:27017/nexusdrive`.

## Getting Started

### 1. Setup Backend
1. Open a terminal in the `backend` folder.
2. Ensure MongoDB is running.
3. Run `npm start` (or `node server.js`).
   - The server will run on `http://localhost:5000`.

### 2. Setup Frontend
1. Open a terminal in the `frontend` folder.
2. Run `npm run dev`.
   - The application will be available at `http://localhost:5173`.

## Folder Structure
- `/backend`: Express server, models, and routes.
- `/frontend`: React application with components and context.
- `/backend/uploads`: Local directory where uploaded files are stored.

## Demo Credentials
You can register a new account directly on the login page to start using your personal drive!
