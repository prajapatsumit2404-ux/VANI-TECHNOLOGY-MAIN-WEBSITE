# Vani Technologies - Official Company Platform

Professional company website and web platform for **Vani Technologies** built with HTML5, CSS3, Tailwind CSS, JavaScript, Node.js, Express.js, and MongoDB.

---

## 📁 Clean Folder Structure

```
vani-technologies/
│
├── frontend/                     # Frontend client code
│   ├── index.html                # Main homepage entry point
│   ├── login.html                # Authentication login page
│   ├── register.html             # User registration page
│   ├── products.html             # Product showcase and catalog
│   ├── contact.html              # Contact and inquiry page
│   ├── css/
│   │   └── style.css             # Custom animations, glassmorphism & typography
│   ├── js/
│   │   ├── main.js               # Global UI scripts, scroll effects, modals
│   │   ├── auth.js               # JWT authentication & session handling
│   │   ├── products.js           # Product search, filter & modals
│   │   └── contact.js            # Contact form submission & validation
│   └── assets/
│       └── images/               # Logos, product screenshots & mockups
│
├── backend/                      # Backend API server
│   ├── server.js                 # Express server configuration & entry point
│   ├── config/
│   │   └── db.js                 # MongoDB database connection
│   ├── controllers/              # Route controller functions (Auth, Products, Contact)
│   ├── middleware/               # Auth guards (JWT, Roles), Rate limiters, Error handlers
│   ├── models/                   # Mongoose schemas (User, Product, Enquiry)
│   ├── routes/                   # API endpoint routers
│   ├── services/                 # Email and OTP services
│   └── utils/                    # Helper functions (JWT sign, validators)
│
├── .env                          # Local environment variables (DO NOT commit)
├── .env.example                  # Template for environment variables
├── .gitignore                    # Git ignore file
├── package.json                  # Node.js dependencies and run scripts
└── README.md                     # Documentation
```

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` (already done for development).

### 3. Start the Server
- **Development Mode (Auto-restart with nodemon):**
  ```bash
  npm run dev
  ```
- **Standard Mode:**
  ```bash
  npm start
  ```

### 4. Open in Browser
- Website: [http://localhost:5000](http://localhost:5000)
- Health API: [http://localhost:5000/api/health](http://localhost:5000/api/health)
