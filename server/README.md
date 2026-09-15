# Onecore Pharma — Backend & Custom CMS API

A custom, secure Node.js + Express.js + MySQL backend architecture for Onecore Pharma.

---

## 🛠️ Tech Stack & Constraints

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 4.x
- **Database:** **MySQL only** (`mysql2/promise` connection pool)
- **Authentication:** JWT (JSON Web Tokens) with 8-hour expiration
- **Password Security:** `bcryptjs` (12 salt rounds)
- **File Uploads:** `multer` with MIME-type filtering and randomized safe filenames
- **Security:** `helmet` headers, strict `cors`, `express-rate-limit` brute-force protection

---

## 📁 Directory Structure

```
server/
├── config/
│   └── db.js                 # MySQL connection pool & query helper
├── controllers/
│   ├── adminUsersController.js
│   ├── authController.js
│   ├── contactsController.js
│   ├── dashboardController.js
│   ├── mediaController.js
│   ├── newsController.js
│   ├── pagesController.js
│   ├── productsController.js
│   ├── settingsController.js
│   └── therapeuticAreasController.js
├── database/
│   ├── schema.sql            # 17 normalized relational MySQL tables
│   └── seed.sql              # Initial roles, settings, areas, products, news
├── middleware/
│   ├── authMiddleware.js     # JWT verification & active user verification
│   ├── roleMiddleware.js     # RBAC (Super Admin, Admin, Editor)
│   ├── uploadMiddleware.js   # Multer file storage & type checking
│   └── errorMiddleware.js    # Global JSON error response handler
├── routes/
│   ├── adminUsersRoutes.js
│   ├── authRoutes.js
│   ├── contactsRoutes.js
│   ├── dashboardRoutes.js
│   ├── mediaRoutes.js
│   ├── newsRoutes.js
│   ├── pagesRoutes.js
│   ├── productsRoutes.js
│   ├── settingsRoutes.js
│   └── therapeuticAreasRoutes.js
├── scripts/
│   ├── initDb.js             # Automated DB creation & schema/seed execution
│   └── createAdmin.js        # CLI Super Admin account generator
├── uploads/                  # Uploaded media assets
├── .env.example              # Environment variable template
├── .env                      # Local environment configuration
├── index.js                  # Main Express server entry point
└── package.json
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have **MySQL Server 8.x** running locally or accessible via network.

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the `server/` directory:

```bash
cp .env.example .env
```

Edit `server/.env`:
```ini
PORT=5000
NODE_ENV=development

# MySQL Database Credentials
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=onecore_pharma

# JWT Secret & Expiry
JWT_SECRET=onecore_pharma_jwt_secure_key_998124_secret_2026
JWT_EXPIRES_IN=8h

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Initialize Database & Seed Content
Run the automated schema and seed import script:

```bash
npm run init-db
```
*This will create the `onecore_pharma` database (if not existing), execute `schema.sql` (17 relational tables), and seed the default roles, site settings, 9 therapeutic areas, OneFLEXO product specifications, and news.*

### 4. Create a Super Admin Account
Generate the first Super Admin user:

```bash
npm run create-admin
```
Or pass credentials directly via CLI:
```bash
node scripts/createAdmin.js "Onecore Admin" "admin@onecorepharma.com" "Admin@12345" "Super Admin"
```

### 5. Start the API Server

```bash
# Development / Production
npm start
```
The server will start on `http://localhost:5000`.

---

## 🔐 Role-Based Access Control (RBAC)

1. **Super Admin**:
   - Manage admin users (create, update role, disable, delete).
   - Edit all content, therapeutic areas, products, pages, settings, media.
   - Delete contact enquiries.
2. **Admin**:
   - Manage website content, therapeutic areas, products, news, media, settings.
   - View, update status, add internal notes, and delete contact enquiries.
3. **Editor**:
   - Edit page content, update therapeutic areas and products, create/edit news articles, upload media.

---

## 📡 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/auth/me` — Verify session and fetch current admin user profile
- `POST /api/auth/change-password` — Change password for current logged-in user
- `POST /api/auth/logout` — Logout user

### Dashboard Metrics (`/api/admin/dashboard`)
- `GET /api/admin/dashboard` — Live counts (therapeutic areas, products, news, new enquiries, recent enquiries)

### Public Contact & Admin Enquiries (`/api`)
- `POST /api/contact` — **Public**: Submit a contact enquiry (persisted to `contact_enquiries` table)
- `GET /api/admin/enquiries` — Admin: List enquiries (filter by `status`, `subject_category`, pagination)
- `GET /api/admin/enquiries/:id` — Admin: Detailed enquiry view
- `PATCH /api/admin/enquiries/:id` — Admin: Update status (`new`, `in_progress`, `resolved`, `archived`) and notes
- `DELETE /api/admin/enquiries/:id` — Super Admin / Admin: Delete enquiry

### Pages & CMS Content (`/api/pages`)
- `GET /api/pages` — List all pages
- `GET /api/pages/:key` — Get full page details including all modular sections
- `PUT /api/pages/sections/:id` — Update specific section JSON content and title

### Therapeutic Areas (`/api/therapeutic-areas`)
- `GET /api/therapeutic-areas` — List active areas with tags
- `GET /api/therapeutic-areas/:id` — Detailed area view
- `PUT /api/therapeutic-areas/:id` — Update area details and tags

### Products (`/api/products`)
- `GET /api/products` — List all products with therapeutic area associations
- `GET /api/products/:identifier` — Get product by ID or slug with compositions, dosage, and safety sections
- `PUT /api/products/:id` — Update product details

### News & Press Releases (`/api/news`)
- `GET /api/news` — List published news (Admin gets all)
- `GET /api/news/:identifier` — News details
- `POST /api/news` — Create news article
- `PUT /api/news/:id` — Update news article
- `DELETE /api/news/:id` — Delete news article

### Media Library (`/api/admin/media`)
- `GET /api/admin/media` — List uploaded media
- `POST /api/admin/media/upload` — Upload image/document (`file` field)
- `DELETE /api/admin/media/:id` — Remove media file and record

### Site Settings (`/api/settings`)
- `GET /api/settings` — Get public contact info & site settings
- `PUT /api/settings/contact` — Update contact settings
- `PUT /api/settings/site/:key` — Update site setting key-value pair

### Admin User Management (`/api/admin/users`) — *Super Admin Only*
- `GET /api/admin/users` — List admin accounts
- `POST /api/admin/users` — Create new admin user
- `PUT /api/admin/users/:id` — Update user details / role / active status
- `DELETE /api/admin/users/:id` — Delete admin user
