![image](https://github.com/user-attachments/assets/0623c6fe-d967-4360-a992-40fa88b12f78)

Drivenest 

Drivenest is a full-stack MERN (MongoDB, Express, React, Node.js) application that enables users to upload, manage, and interact with various types of data in a clean and responsive dashboard UI.

🚀 Features

- 📤 Upload and manage files easily
- 👤 User authentication with JWT
- 🔐 Password hashing with bcrypt
- 🛡️ Secure API using Express middlewares
- 🌐 Cross-Origin Resource Sharing (CORS) enabled
- 📂 Structured backend with controllers, models, and routes
- 🔎 Input validation using Zod
- ☁️ Environment variables managed via `.env`
- 📁 File uploads handled with Multer

📦 Tech Stack

| Frontend | Backend | Database | Other |
|----------|---------|----------|-------|
| React    | Express | MongoDB  | Node.js, JWT, Bcrypt, Multer, Zod |

📁 Project Structure

Drivenest/
├── client/ # React frontend
├── server/ # Node.js backend
│ ├── controllers/ # Logic for handling requests
│ ├── middleware/ # Authentication, error handling
│ ├── models/ # MongoDB models
│ ├── router/ # API route definitions
│ ├── uploads/ # Uploaded files
│ ├── utils/ # Helper functions
│ ├── validators/ # Input validation schemas
│ ├── server.js # Entry point
│ └── .env # Environment variables (ignored in Git)
├── .gitignore
├── package.json
└── README.md
