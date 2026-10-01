# Vani Technologies — Official Enterprise Digital Platform

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Database: MongoDB](https://img.shields.io/badge/database-MongoDB-green.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-black?logo=three.js&logoColor=white)](https://threejs.org/)

The official enterprise web platform for **Vani Technologies** — an engineering and digital transformation company delivering next-generation IT services, custom cloud software, AI agents, mobile applications, and enterprise digital platforms.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features](#2-features)
3. [Tech Stack](#3-tech-stack)
4. [Folder Structure](#4-folder-structure)
5. [Installation](#5-installation)
6. [Environment Variables](#6-environment-variables)
7. [Backend Setup](#7-backend-setup)
8. [Frontend Setup](#8-frontend-setup)
9. [MongoDB Setup](#9-mongodb-setup)
10. [API Endpoints](#10-api-endpoints)
11. [Authentication & Security](#11-authentication--security)
12. [Testing](#12-testing)
13. [Production Deployment](#13-production-deployment)
    - [Frontend Deployment](#frontend-deployment)
    - [Backend Deployment](#backend-deployment)
    - [MongoDB Deployment](#mongodb-deployment)
14. [Production Readiness Checklist](#14-production-readiness-checklist)

---

## 1. Project Overview

Vani Technologies engineered this unified platform to provide:
- A high-performance, responsive corporate portal showcasing IT services and software platforms.
- An interactive **Three.js 3D Digital Intelligence Core** hero visualization reacting to user mouse movements and scroll events.
- A client-side portfolio browser featuring dynamic categories, real-time search, deep-linking URL routing (`#/products/:id`), and interactive product modals.
- Complete, secure multi-channel user authentication supporting Email/Password, Phone OTP verification, SHA-256 email tokens, and password reset flows.
- An enterprise Role-Based Access Control (RBAC) Admin Dashboard providing analytics, user management, and product CRUD operations.
- Production-grade security with Helmet, rate limiting, MongoDB validation, and sanitization.

---

## 2. Features

- **Hero 3D Digital Core**: Fullscreen Three.js background canvas with particle networks, orbital telemetry rings, and interactive particle bursts that never blocks UI interaction.
- **Service Catalog**: 12 interactive cards with comprehensive modal breakdowns covering deliverables, technology stacks, and business impact.
- **Featured Product Showcase**: 8 enterprise software platforms with instant search, category filters, technical specifications, and Add to Cart / Inquiry actions.
- **Client-Side Deep Linking**: Hash-based URL routing (`#/products/:id`) enabling direct product link sharing and browser history navigation.
- **Dual-Mode Authentication**:
  - Registration with duplicate email/phone prevention and bcrypt hashing (12 salt rounds).
  - Login by Email or Phone number.
  - Development mock OTP mode or production SMS gateway integration.
  - Cryptographically hashed email verification tokens (SHA-256) with 24-hour expiry.
- **Admin Dashboard**:
  - Real-time KPI summary (users, contacts, active products).
  - User directory with role promotion/demotion and self-protection shields.
  - Complete Product CRUD with status toggles (`active`, `draft`, `archived`) and featured badges.
  - Contact enquiry telemetry and lifecycle tracker (`new`, `contacted`, `resolved`, `archived`).
- **Contact & Lead Pipeline**: Secure project consultation form with character validation, client auto-fill for logged-in users, and anti-spam rate limiting.
- **Accessibility & Motion Comfort**: Full compliance with `prefers-reduced-motion: reduce`, semantic dialog roles, and `:focus-visible` keyboard outlines.
- **SEO & Social Sharing**: Complete Open Graph, Twitter Cards, `robots.txt`, and XML `sitemap.xml`.

---

## 3. Tech Stack

### Frontend
- **Markup & Styling**: HTML5, Tailwind CSS, Custom Modern CSS with Glassmorphism
- **3D Graphics**: Three.js (r128)
- **Scroll Effects**: AOS (Animate On Scroll)
- **Icons & Typography**: FontAwesome 6 Pro, Plus Jakarta Sans, Space Grotesk
- **Client Scripting**: Vanilla JavaScript (ES6+ modular architecture, zero heavy frontend framework overhead)

### Backend
- **Runtime**: Node.js (v20+ LTS / v24+)
- **Server Framework**: Express.js 4.x
- **Database Driver**: Mongoose 8.x
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **Security Middlewares**: `helmet`, `cors`, `express-rate-limit`
- **Logging**: `morgan` (combined in production, dev in development)

### Database
- **Engine**: MongoDB (Atlas or Self-Hosted Community Server 7.x/8.x)

---

## 4. Folder Structure

```
vani-technologies/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic with retry & events
│   ├── controllers/
│   │   ├── adminController.js    # Dashboard telemetry, user management, settings
│   │   ├── authController.js     # Register, login, OTP, email verify, password reset
│   │   ├── contactController.js  # Enquiry submissions, status updates, pagination
│   │   └── productController.js  # Product catalog, CRUD mutations, slug resolution
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & RBAC authorization guards
│   │   └── errorHandler.js       # Centralized error formatter (hides stack in prod)
│   ├── models/
│   │   ├── Contact.js            # Customer project inquiry schema
│   │   ├── Product.js            # Portfolio product schema with search indexes
│   │   └── User.js               # User schema with bcrypt hooks & token generators
│   ├── routes/
│   │   ├── adminRoutes.js        # Protected /api/admin/* endpoints
│   │   ├── authRoutes.js         # Public /api/auth/* authentication endpoints
│   │   ├── contactRoutes.js      # /api/contact endpoints with rate limiter
│   │   └── productRoutes.js      # /api/products endpoints (public GET + admin CRUD)
│   ├── services/
│   │   └── emailService.js       # Transactional email provider & dev mock engine
│   ├── tests/
│   │   ├── check_assets.js       # Local asset, script, and stylesheet integrity audit
│   │   ├── test_phase6.js        # Verification & OTP automated test suite
│   │   ├── test_phase7.js        # Contact system automated test suite
│   │   ├── test_phase8.js        # Admin dashboard & RBAC automated test suite
│   │   └── test_phase10.js       # Complete end-to-end regression test suite
│   ├── utils/
│   │   └── seedProducts.js       # Automated product catalog seeder
│   └── server.js                 # Express server entry point with Helmet & CORS
│
├── frontend/
│   ├── assets/
│   │   └── images/               # Branded logos, mockups, and portfolio images
│   ├── css/
│   │   └── style.css             # Fluid styling, 3D cards, animations, responsive design
│   ├── js/
│   │   ├── admin.js              # Admin Dashboard controller and dynamic tables
│   │   ├── auth.js               # Client auth helper, token manager, and API client
│   │   ├── main.js               # Core UI engine, 3D reactions, filters, modals, routing
│   │   ├── three-background.js   # Three.js 3D hero engine & particle networks
│   │   └── three.min.js          # Three.js library bundle
│   ├── admin.html                # Enterprise Admin Dashboard interface
│   ├── contact.html              # Dedicated Contact page
│   ├── forgot-password.html      # Self-service password recovery
│   ├── index.html                # Corporate homepage with 3D hero & product catalog
│   ├── login.html                # Dual-mode Email/Phone login interface
│   ├── profile.html              # Protected user profile & verification center
│   ├── register.html             # Account registration interface
│   ├── robots.txt                # Search engine crawler directives
│   ├── sitemap.xml               # Standard XML sitemap for SEO indexing
│   ├── verify-email.html         # Token-based email verification receiver
│   └── verify-phone.html         # 6-digit OTP phone verification interface
│
├── .env.example                  # Environment configuration template
├── .gitignore                    # Sensitive file exclusions
├── package.json                  # Dependencies & npm scripts
└── README.md                     # Production documentation
```

---

## 5. Installation

### Prerequisites
- Node.js version 20.x or higher installed.
- MongoDB running locally on port 27017 or a MongoDB Atlas connection string.
- Git.

### Step-by-Step Installation
```bash
# 1. Clone repository
git clone https://github.com/shashikantvani/vani-technologies.git
cd vani-technologies

# 2. Install production and development dependencies
npm install
```

---

## 6. Environment Variables

Create a `.env` file in the root directory by copying the template:

```bash
cp .env.example .env
```

Configure your variables as follows:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | HTTP port the Express server listens on | `5000` |
| `NODE_ENV` | Application environment (`development` / `production`) | `production` |
| `CLIENT_URL` | Canonical frontend domain for CORS whitelist | `https://www.vanitechnologies.in` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/vani_technologies` |
| `JWT_SECRET` | Cryptographic secret for signing tokens | `generate-random-64-character-hex-string` |
| `JWT_EXPIRES_IN` | Token validity duration | `7d` |
| `MOCK_OTP` | Toggle dev mock OTP (`true`) vs live SMS gateway (`false`) | `false` |
| `RATE_LIMIT_MAX` | Maximum API requests per IP per 15-minute window | `100` |

> **Security Note**: Never commit your `.env` file to version control. It is strictly excluded in `.gitignore`.

---

## 7. Backend Setup

To start the backend in development with hot-reload:
```bash
npm run dev
```

To run the backend in standard production mode:
```bash
npm start
```

Verify backend health:
```bash
curl http://localhost:5000/api/health
```

---

## 8. Frontend Setup

The frontend consists of static assets served directly through Express's optimized static file handler.
- Static assets are located in the `frontend/` directory.
- No compilation or build step (Webpack/Vite) is strictly required, ensuring near-instant loading, zero build fragility, and clean CDN compatibility.
- Tailwind CSS and FontAwesome are delivered via high-speed global CDNs.

To preview the frontend:
Navigate to `http://localhost:5000` in any modern web browser.

---

## 9. MongoDB Setup

### Option A: Local MongoDB
1. Ensure MongoDB Community Server is installed and running:
   ```bash
   mongod --dbpath /data/db
   ```
2. The database `vani_technologies` will be created automatically upon connection.
3. Default products are seeded automatically on first boot via `seedProductsIfNeeded()`.

### Option B: MongoDB Atlas (Cloud)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User with read/write privileges.
3. Whitelist your server IP address (or `0.0.0.0/0` with secure credentials).
4. Update `MONGODB_URI` in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://<db_user>:<db_password>@cluster0.mongodb.net/vani_technologies?retryWrites=true&w=majority
   ```

---

## 10. API Endpoints

### System & Catalog
- `GET /api/health` — Health status check.
- `GET /api/products` — Retrieve active portfolio products (supports `?category=`, `?search=`).
- `GET /api/products/:id` — Retrieve product by MongoDB ObjectId or URL slug (e.g. `ai-talksy`).
- `POST /api/products` — Create product *(Admin only)*.
- `PUT /api/products/:id` — Update product *(Admin only)*.
- `DELETE /api/products/:id` — Delete product *(Admin only)*.

### Contact & Inquiries
- `POST /api/contact` — Submit a project inquiry (rate-limited, validated).
- `GET /api/contact` — Retrieve all inquiries *(Admin only)*.
- `GET /api/contact/:id` — Retrieve single inquiry *(Admin only)*.
- `PATCH /api/contact/:id/status` — Update inquiry workflow status *(Admin only)*.

### Authentication
- `POST /api/auth/register` — Register account with email, phone, and password.
- `POST /api/auth/login` — Authenticate using Email or Phone.
- `GET /api/auth/me` — Retrieve authenticated user profile *(Requires JWT)*.
- `POST /api/auth/logout` — Revoke session.
- `POST /api/auth/send-otp` — Request 6-digit phone verification OTP.
- `POST /api/auth/verify-otp` — Verify phone OTP (max 5 attempts, 10-minute expiry).
- `GET /api/auth/verify-email` — Verify email token.
- `POST /api/auth/forgot-password` — Generate self-service password reset token.
- `POST /api/auth/reset-password` — Set new password with valid reset token.

### Admin Dashboard (Protected: Admin Role Required)
- `GET /api/admin/dashboard` — Platform telemetry and executive overview.
- `GET /api/admin/users` — User directory with search and role filters.
- `PATCH /api/admin/users/:id/role` — Promote or demote user roles.
- `DELETE /api/admin/users/:id` — Remove user account.
- `GET /api/admin/analytics` — Service and category lead distribution metrics.
- `GET /api/admin/settings` — Company metadata and configuration.

---

## 11. Authentication & Security

- **Password Storage**: Passwords are salted and hashed using `bcryptjs` with 12 calculation rounds.
- **JWT Protection**: Standard Bearer authorization tokens signed with SHA-256 HMAC.
- **Secret Redaction**: Passwords, OTP hashes, and reset tokens are excluded from all query projections by default (`select: false`).
- **Rate Limiting**:
  - Global API: 100 requests per 15 minutes per IP in production.
  - Authentication: 30 attempts per 15 minutes per IP to eliminate credential stuffing.
- **CORS Shield**: Restricted to `CLIENT_URL` and `vanitechnologies.in` in production.
- **HTTP Headers**: Enforced using `helmet` to mitigate clickjacking, MIME sniffing, and cross-site scripting.

---

## 12. Testing

The platform includes comprehensive automated test suites covering 100% of core APIs, authentication guards, security edge cases, asset integrity, and accessibility.

Run the full automated test suite:
```bash
npm run test:all
```

Run individual test passes:
```bash
# Phase 6: Email Token & OTP Verification Suite (42 tests)
node backend/tests/test_phase6.js

# Phase 7: Contact Pipeline & Admin Protection (22 tests)
node backend/tests/test_phase7.js

# Phase 8: Admin Dashboard & RBAC Guards (41 tests)
node backend/tests/test_phase8.js

# Phase 10: End-to-End Regression & Responsive Audit (72 tests)
node backend/tests/test_phase10.js

# Frontend Assets & Link Integrity Check (95 references)
node backend/tests/check_assets.js
```

---

## 13. Production Deployment

### Frontend Deployment

#### Option A: Served via Node.js Express (Current Unified Architecture)
Because `backend/server.js` already serves static files from `frontend/`, your entire site runs from a single unified server instance.
- Static assets are cached and compressed.
- No separate frontend web server configuration is required.

#### Option B: Deploying Frontend to CDN / Static Hosting (Vercel, Netlify, Cloudflare Pages, S3/CloudFront)
If you wish to host the frontend separately on an edge CDN:
1. Upload the entire `frontend/` directory to your static host.
2. In `frontend/js/auth.js`, update the API prefix:
   ```javascript
   const AUTH_API = 'https://api.vanitechnologies.in/api/auth';
   ```
3. Configure URL rewrites so all route requests fallback to `index.html`.
4. Add your CDN domain to the backend's `.env` under `CLIENT_URL`.

---

### Backend Deployment

#### Option A: Linux VPS (Ubuntu / Debian + PM2 + Nginx)
1. **Server Provisioning**:
   ```bash
   sudo apt update && sudo apt install -y nodejs npm nginx
   sudo npm install -g pm2
   ```

2. **Clone & Install**:
   ```bash
   git clone https://github.com/shashikantvani/vani-technologies.git /var/www/vani-technologies
   cd /var/www/vani-technologies
   npm install --production
   cp .env.example .env
   nano .env  # Add your production credentials
   ```

3. **Start with Process Manager (PM2)**:
   ```bash
   pm2 start backend/server.js --name "vani-backend" -i max
   pm2 save
   pm2 startup
   ```

4. **Nginx Reverse Proxy Configuration**:
   Create `/etc/nginx/sites-available/vanitechnologies.in`:
   ```nginx
   server {
       listen 80;
       server_name vanitechnologies.in www.vanitechnologies.in;

       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Enable site and obtain free SSL certificate via Let's Encrypt:
   ```bash
   sudo ln -s /etc/nginx/sites-available/vanitechnologies.in /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl restart nginx
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d vanitechnologies.in -d www.vanitechnologies.in
   ```

#### Option B: Containerized Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "backend/server.js"]
```

---

### MongoDB Deployment

1. **MongoDB Atlas (Recommended)**:
   - Create a Dedicated (M10+) or Shared (M0) cluster on AWS/GCP.
   - Enable **Automated Daily Backups**.
   - Create database user with `readWrite` role on `vani_technologies`.
   - Restrict Network Access to your VPS Elastic IP address.
   - Obtain connection string and update `MONGODB_URI` in `.env`.

2. **Self-Hosted MongoDB Security**:
   - Enable authentication in `/etc/mongod.conf`:
     ```yaml
     security:
       authorization: enabled
     ```
   - Bind only to `127.0.0.1` unless connecting over an encrypted private VPC.
   - Set up automated `mongodump` cron backups to S3/Cloud Storage.

---

## 14. Production Readiness Checklist

- [x] **Environment Variables**: Template created in `.env.example`, `.env` excluded in `.gitignore`.
- [x] **Database Resilience**: MongoDB connection retry handling and connection event logging.
- [x] **Password Hashing**: 12 salt rounds using `bcryptjs` with timing-safe comparison.
- [x] **JWT Security**: Cryptographically signed tokens with configurable expiration (`7d`).
- [x] **HTTP Security Headers**: `helmet` enabled with strict origin policies.
- [x] **CORS Configuration**: Dynamic whitelist matching production domains.
- [x] **DDoS & Brute Force Prevention**: Two-tier rate limiters (`express-rate-limit`) on API and Auth routes.
- [x] **Error Shielding**: Stack traces suppressed in production error responses.
- [x] **SEO & Social Sharing**: Complete Open Graph, Twitter Cards, `robots.txt`, and XML `sitemap.xml`.
- [x] **Asset Verification**: 0 broken images, scripts, stylesheets, or internal links verified.
- [x] **Accessibility**: WCAG motion reduction (`prefers-reduced-motion`) and `:focus-visible` styling verified.
- [x] **Automated Test Coverage**: 177 / 177 automated test assertions passed (100%).

---

© 2026 **Vani Technologies**. All rights reserved.
