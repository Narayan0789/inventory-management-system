# 📦 StockPilot — Smart Inventory Management System (IMS)
### 🎓 Final Year / College Project (Full Stack MERN Architecture)

---

## 🌟 1. Project Overview
**StockPilot** ek full-stack web application hai jo retail shops, warehouses aur businesses ke liye complete inventory life-cycle manage karta hai:
- **Product Management:** CRUD operations, SKU tracking, pricing, and reorder levels.
- **Stock Alert System:** Minimum safety limit monitor jo automatic low-stock aur out-of-stock warning triggers karta hai.
- **Stock Movements (In & Out):**
  - **Stock-In:** Suppliers se purchase receive karna aur stock automatically increment karna ($\text{Available} = \text{Opening} + \text{In}$).
  - **Stock-Out / POS Billing:** Customer counter sales, atomic stock deduction ($\text{Available} = \text{Current} - \text{Sold}$), overselling validation, aur instant printable tax invoice generation.
- **Role-Based Access Control (RBAC):** Admin (full system controller) vs Staff (POS billing & stock entry operator).
- **Extra College-Impressive Features:**
  - 🖨️ **Printable Tax Invoices / Cash Receipts** (`window.print()`).
  - 📊 **One-click CSV Export** of inventory records and sales ledger.
  - 🔔 **Real-time Alert Counter Badge** in Top Navigation & Sidebar.
  - 📈 **Category Stock Distribution Analytics**.

---

## 🛠️ 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | Fast, responsive Single Page Application (SPA) |
| **Styling** | Tailwind CSS | Modern clean UI, responsive cards & tables |
| **Icons** | Lucide React | Professional icon system |
| **Backend** | Node.js + Express.js | RESTful APIs, JWT middleware, business logic |
| **Database** | MongoDB + Mongoose | Schema validation, virtual status fields, atomic updates |
| **Authentication** | JSON Web Tokens (JWT) + Bcrypt.js | Secure password hashing and role-based route gating |

---

## 📁 3. Folder Structure (Clean Separation for VS Code)

```text
inventory-management-system/
│
├── backend/                             # Express + MongoDB Server
│   ├── config/
│   │   └── db.js                        # Mongoose MongoDB connection
│   ├── controllers/
│   │   ├── authController.js            # Login, Registration & User profile logic
│   │   ├── productController.js         # Products CRUD, search, and stock alert queries
│   │   ├── transactionController.js     # Stock-In, POS Billing & Invoice generation
│   │   └── dashboardController.js       # Real-time revenue, stock valuation, and analytics
│   ├── middleware/
│   │   └── authMiddleware.js            # JWT verification & role authorization (Admin check)
│   ├── models/
│   │   ├── User.js                      # User Schema (roles: 'admin' | 'staff')
│   │   ├── Product.js                   # Product Schema with virtual 'stockStatus' & 'minStockLimit'
│   │   └── Transaction.js               # Sales and Purchase ledger with items array
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── dashboardRoutes.js
│   ├── seed.js                          # Database seeder (Sample electronics products & test users)
│   ├── server.js                        # Express server entrypoint
│   ├── .env                             # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   └── package.json
│
└── frontend/                            # React + Tailwind SPA (Vite)
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx               # Top header with stock alert bell counter
    │   │   ├── Sidebar.jsx              # Navigation drawer with low-stock count badge
    │   │   ├── ProtectedRoute.jsx       # Route guard for authenticated / admin-only pages
    │   │   ├── StatCard.jsx             # Metric card for dashboard statistics
    │   │   ├── ProductModal.jsx         # Add / Edit product dialog
    │   │   └── InvoiceModal.jsx         # Professional printable customer invoice modal
    │   ├── context/
    │   │   └── AuthContext.jsx          # User session, JWT tokens, login & logout state
    │   ├── pages/
    │   │   ├── Login.jsx                # Login screen with 1-click Demo credentials
    │   │   ├── Dashboard.jsx            # KPI cards, critical alerts, category breakdown
    │   │   ├── Products.jsx             # Inventory table with search, filters & CSV export
    │   │   ├── StockAlerts.jsx          # Dedicated low-stock & out-of-stock monitor
    │   │   ├── SalesBilling.jsx         # POS counter billing with real-time stock validation
    │   │   ├── StockIn.jsx              # Supplier purchase order entry & stock addition
    │   │   ├── Transactions.jsx         # Complete history of invoices with reprint buttons
    │   │   └── Users.jsx                # Admin console to manage staff accounts
    │   ├── services/
    │   │   └── api.js                   # Axios client with auto Bearer token interceptor
    │   ├── App.jsx                      # Router & layout shell
    │   ├── main.jsx                     # React root mount
    │   └── index.css                    # Tailwind directives & print utility styles
    ├── vite.config.js                   # Vite config with proxy to backend port 5000
    ├── tailwind.config.js
    └── package.json
```

---

## ⚡ 4. How to Run the Project (Step-by-Step for VS Code)

### Step 1: Open Terminal in Backend
```bash
cd backend
# 1. Install dependencies (agar pehle nahi kiya ho)
npm install

# 2. Seed realistic demo data into MongoDB
node seed.js

# 3. Start Backend Server
npm start
```
*Backend runs at:* `http://localhost:5000`

### Step 2: Open Terminal in Frontend
```bash
cd frontend
# 1. Install dependencies (agar pehle nahi kiya ho)
npm install

# 2. Start Frontend Dev Server
npm run dev
```
*Frontend runs at:* `http://localhost:5173`

---

## 🔑 5. Default Credentials for College Demo

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** 👑 | `admin@shop.com` | `password123` | Full Access: Add/Edit/Delete products, Manage Users, View Inventory Valuation |
| **Staff** 👤 | `staff@shop.com` | `password123` | Operational Access: View Stock, Create Sales (POS), Record Stock-In |

*(Tip: Login page par "Quick Demo Logins" buttons diye gaye hain jisme 1-click se credentials auto-fill ho jaate hain).*

---

## 💡 6. College Viva & Technical Interview Q&A

### Q1. Inventory Management System kya hota hai aur iska core purpose kya hai?
**Answer:** Inventory Management System ek software application hai jo business ke paas kitna maal hai (stock), kitna maal aaya (Stock-In/Purchases), kitna maal bika (Stock-Out/Sales), aur kitna maal reorder karna hai, isko automatically record aur track karta hai. Iska main formula hai:
$$\text{Available Stock} = \text{Opening Stock} + \text{Stock In} - \text{Stock Out}$$

### Q2. Stock Alert System kaise kaam karta hai?
**Answer:** Har product mein ek `minStockLimit` (Reorder Point) configure hota hai.
- Agar $\text{Quantity} = 0 \implies$ **Out of Stock** (Customer ko sell karna block ho jata hai).
- Agar $\text{Quantity} \le \text{minStockLimit} \implies$ **Low Stock Alert** (System automated notification trigger karta hai taaki supplier se naya stock reorder kiya ja sake).
- Agar $\text{Quantity} > \text{minStockLimit} \implies$ **In Stock** (Healthy inventory status).

### Q3. Role-Based Access Control (RBAC) kaise implement kiya gaya hai?
**Answer:**
- **Backend:** Express middleware `authorize('admin')` check karta hai ki user ke JWT token mein decoded `role === 'admin'` hai ya nahi. Agar normal staff user product delete karne ki koshish kare, toh backend `403 Forbidden` return karta hai.
- **Frontend:** `ProtectedRoute` component verify karta hai aur Admin-only buttons/pages staff ke UI se hide rehte hain.

### Q4. Overselling (Negative Stock) ko prevent kaise kiya gaya hai?
**Answer:** Sales billing ke waqt `transactionController.js` pehle cart ke har item ka stock database se fetch karke check karta hai:
```js
if (product.quantity < requestedQty) {
  return res.status(400).json({
    message: `Insufficient stock for "${product.name}". Available: ${product.quantity}, Requested: ${requestedQty}`
  });
}
```
Validation pass hone par hi stock deduct hota hai. Isse database mein kabhi bhi negative quantity nahi hoti.

### Q5. MongoDB Virtuals kya hote hain aur yahan kaise use hue hain?
**Answer:** `stockStatus` virtual property hai jo MongoDB database mein physically store nahi hoti, balki query ke waqt `quantity` aur `minStockLimit` ko compare karke on-the-fly calculate hoti hai (`in-stock`, `low-stock`, `out-of-stock`). Isse data duplication nahi hoti.

### Q6. Forgot Password via Gmail OTP ka security flow kya hai?
**Answer:**
1. **Request Phase:** User apna registered email enter karta hai. Backend secure 6-digit numeric OTP generate karke user document mein `resetOtp` aur `resetOtpExpires` (10 minutes) save karta hai.
2. **Dispatch Phase:** `nodemailer` ke through user ke Gmail par OTP send hota hai. (Testing / Viva demo mode mein terminal console par bhi dispatch log dikhta hai).
3. **Verification Phase:** User OTP aur naya password enter karta hai. Backend match verify karke bcrypt se password hash karke save karta hai aur OTP fields clear kar deta hai.

### Q7. Sign in with Google (Staff OAuth) kaise kaam karta hai?
**Answer:** Google account se login karte waqt backend par `/api/auth/google-auth` request jaati hai. Agar account pehle se exist karta hai toh use direct authenticate karta hai; agar new user hai toh automatically usse **Staff Role** ke sath secure random credentials assign karke JWT token issue kar deta hai.
