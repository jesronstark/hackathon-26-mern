# HACKATHON-26 – Code The Core
## MERN Stack Registration System

**Event:** HACKATHON-26 – Code The Core  
**Theme:** Embedded C & Microcontroller Programming  
**Organized by:** Naan Mudhalvan & Ingage Technologies Pvt Ltd  
**Venue:** SACS MAVMM Engineering College, Alagar Kovil, Madurai – 625301  
**Date:** 17/03/2026 | 10:00 AM – 01:00 PM | Auditorium

---

## 📁 Project Structure

```
mern-hackathon/
├── client/                  # React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Public landing page
│   │   │   ├── RegisterPage.jsx     # Team registration form
│   │   │   ├── AdminLogin.jsx       # Admin login page
│   │   │   └── AdminDashboard.jsx   # Admin control panel
│   │   ├── utils/
│   │   │   └── api.js               # Axios API utility
│   │   ├── App.jsx                  # Router setup
│   │   └── index.css                # Neon hackathon theme
│   └── vite.config.js
│
└── server/                  # Node.js + Express Backend
    ├── models/
    │   └── Team.js                  # MongoDB Schema
    ├── controllers/
    │   ├── teamController.js        # CRUD logic
    │   └── adminController.js       # Admin + Excel export
    ├── routes/
    │   ├── teamRoutes.js
    │   └── adminRoutes.js
    ├── middleware/
    │   ├── upload.js                # Multer file upload
    │   └── auth.js                  # JWT authentication
    ├── uploads/ppt/                 # Uploaded PPT files stored here
    ├── index.js                     # Server entry point
    └── .env                         # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Setup Server

```bash
cd server

# Edit .env with your MongoDB URI
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/hackathon26

npm install
npm run dev        # development
# npm start        # production
```

### 2. Setup Client

```bash
cd client

# For development (uses Vite proxy to localhost:5000)
npm run dev

# For production build
# Create .env with: VITE_API_URL=https://your-backend-url.com/api
npm run build
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/team-count` | ❌ Public | Live team count |
| `POST` | `/api/register-team` | ❌ Public | Register a team (multipart/form-data) |
| `GET` | `/api/teams` | ✅ Admin | Get all teams |
| `GET` | `/api/team/:id` | ✅ Admin | Get single team |
| `DELETE` | `/api/team/:id` | ✅ Admin | Delete team + PPT |
| `POST` | `/api/admin/login` | ❌ Public | Admin login → JWT token |
| `GET` | `/api/admin/dashboard` | ✅ Admin | Stats (total/registered/remaining) |
| `GET` | `/api/admin/export-excel` | ✅ Admin | Download Excel sheet |

---

## 🔐 Admin Credentials

Default credentials (set in `server/.env`):
- **Username:** `admin`
- **Password:** `hackathon2026`

Admin panel URL: `http://localhost:5173/admin`

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd client
npm run build
# Upload dist/ to Vercel or link GitHub repo
# Set env: VITE_API_URL=https://your-render-app.onrender.com/api
```

### Backend → Render / Railway
```bash
# Push server/ to GitHub
# Set environment variables in Render dashboard:
# MONGO_URI, PORT, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD
```

### Database → MongoDB Atlas
1. Create cluster at mongodb.com/atlas
2. Get connection string
3. Set in server/.env as MONGO_URI

---

## ⚙️ Features

- ✅ Public landing page with circuit board neon design
- ✅ Live team count (auto-refreshes every 30s)
- ✅ Team registration with PPT/PDF upload
- ✅ Automatic table number assignment (1–25)
- ✅ 25-team maximum cap with auto-close
- ✅ Success screen showing team ID + table number
- ✅ Admin login with JWT authentication
- ✅ Admin dashboard with stats + progress bar
- ✅ Sortable/searchable team table
- ✅ PPT download per team
- ✅ Delete team with PPT file cleanup
- ✅ Export all teams to Excel
- ✅ Mobile responsive throughout
