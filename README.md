# 🧾 Smart Expense & Budget Tracker (MERN + AI)

A full‑stack personal finance management application built with the **MERN stack**.  
This project helps users track income & expenses, manage monthly budgets, and use **AI-powered natural language input** to simplify expense entry.

---

## 🌟 Highlights

- Secure user authentication (JWT)
- Track income & expenses
- Monthly category budgets
- Real‑time financial analytics
- AI-powered expense parsing  
  > Example: *"Paid 350 for pizza at Dominos"* → **Amount: 350, Category: Food**
- Clean scalable backend architecture

---

## 🧑‍💻 Tech Stack

| Layer | Technology |
|------|-----------|
Frontend | React |
Backend | Node.js, Express |
Database | MongoDB |
Auth | JWT, bcrypt |
AI | NLP API |
Charts | Chart.js / Recharts |

---

## 🗂️ Project Structure

Backend/
│
├── Database/
│ └── ConnectDB.js
│
├── Schema/
│ ├── UserSchema.js
│ ├── TransactionSchema.js
│ └── BudgetSchema.js
│
├── Controllers/
│ ├── authController.js
│ ├── transactionController.js
│ ├── budgetController.js
│ ├── analyticsController.js
│ └── aiController.js
│
├── Routes/
│ ├── authRoutes.js
│ ├── transactionRoutes.js
│ ├── budgetRoutes.js
│ ├── analyticsRoutes.js
│ └── aiRoutes.js
│
├── Middlewares/
│ └── authMiddleware.js
│
├── server.js
├── package.json
└── .env