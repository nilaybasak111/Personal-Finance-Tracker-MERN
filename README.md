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

## 🚀 Features

### 🔐 Authentication

- User registration & login
- JWT‑based authentication
- Secure protected routes

### 🧾 Transaction Management

- Create single transaction (manual entry)
- Create **multiple transactions at once** (AI input)
- Fully validated requests
- User‑scoped data storage

### 🤖 AI Transaction Parsing

- Converts messy natural language into structured transactions
- Supports **multiple events in one prompt**
- User confirms before saving
- Safe AI pipeline with schema validation

### 🧺 Bulk Insert Engine

- Save one or many transactions in a single request
- Atomic database insertion
- Designed for AI‑generated data

---

## 🧱 System Architecture

Client
→ Auth API
→ AI Parse API
→ User Confirmation
→ Bulk Save API
→ Database

### Request Pipeline

Request
→ authMiddleware
→ validation middleware
→ controller logic
→ MongoDB
→ response

---

## 🧰 Tech Stack

- **Node.js**
- **Express**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **HuggingFace Inference API (via OpenAI SDK)**
- **Custom Validators**

---

## 📦 Main API Endpoints

### 🔐 Auth

| Method | Route                | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register user |
| POST   | `/api/auth/login`    | Login user    |

---

### 🤖 AI

| Method | Route           | Description                              |
| ------ | --------------- | ---------------------------------------- |
| POST   | `/api/ai/parse` | Parse natural language into transactions |

**Example Input**

```json
{ "text": "I received 1000 from mom and spent 200 on pizza" }

Example Output:
{
  "transactions": [
    { "type": "income", "amount": 1000, "category": "Family", "description": "Received money from mom", "confidence": 0.97 },
    { "type": "expense", "amount": 200, "category": "Food", "description": "Ate pizza", "confidence": 0.94 }
  ]
}
```

### 🧾 Transactions

| Method | Route                    | Description                               |
| ------ | ------------------------ | ----------------------------------------- |
| POST   | `/api/transactions`      | Save single transaction                   |
| POST   | `/api/transactions/bulk` | Save multiple transactions (AI confirmed) |

### 🧪 Example AI → DB Flow

User types text
 → POST /api/ai/parse
 → User confirms parsed output
 → POST /api/transactions/bulk
 → Transactions saved

---
## 🛡️ Security & Validation
  - JWT authentication
  - Request validation for all endpoints
  - AI output normalization & safety checks
  - User‑scoped database writes

## 🧠 Design Highlights
  - Supports single & multi‑transaction AI prompts
  - Prevents AI mistakes via user confirmation
  - Clean separation of concerns
  - Production‑grade backend architecture

---

## 🏁 Current Status

Backend Core: Complete ✅
Ready for frontend development and analytics integration.