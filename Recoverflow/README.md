# 🔄 RecoverFlow — Agentic Revenue Recovery

> Built for **Razorpay Buildathon 2025 — Track 03: AI Revenue Recovery**

---

## 💡 The Problem

Every day, thousands of payments fail silently across India. A UPI timeout. An expired card. Insufficient funds. The merchant loses revenue. The customer gets no help. Nobody follows up.

I personally experienced this — a ₹63,000 payment to a truck driver failed due to a UPI timeout. He thought he was scammed. I had no way to send him a recovery link or explain what happened.

**RecoverFlow** is built to solve exactly this.

---

##  What RecoverFlow Does

RecoverFlow is a full-stack AI agent that:

1. **Detects failed payments** from a live Supabase database
2. **Classifies the root cause** automatically (bank downtime, insufficient funds, expired card, etc.)
3. **Checks guardrails** — blocks automated outreach for high-value transactions (>₹1,00,000) and escalates to human support
4. **Generates a secure Razorpay payment recovery link** via a Node.js backend (Secret Key never exposed to the browser)
5. **Streams a personalized Hinglish WhatsApp recovery message** using Google Gemini 3.6 Flash AI — in real time, word by word
6. **Logs every action** to a full Audit Trail in Supabase for compliance and tracking

---

##  Security Architecture

Most hackathon projects make a critical mistake — they put the Razorpay Secret Key directly in the frontend React code where anyone can steal it from the browser.

RecoverFlow does it the right way:

    Browser (React) → Our Node.js Server → Razorpay API

The Secret Key never leaves the backend server. This is production-grade API security.

---

##  Key Features

| Feature | Description |
|---|---|
|  AI Streaming | Gemini 3.6 Flash streams the WhatsApp message word by word in real time |
|  Guardrails | High-value transactions (>₹1L) are blocked from automation and escalated |
|  Smart Routing | Root cause classifier routes each failure to the right recovery strategy |
|  Secure Links | Razorpay payment links generated via Node.js backend, never in the browser |
|  Audit Trail | Every AI action is logged to Supabase with timestamp and message |
|  Batch Processing | One click to autonomously process up to 3 failed payments in sequence |
|  WhatsApp Dispatch | One click to send the AI message directly via WhatsApp |

---

##  AI Agent Strategies

The triage engine maps failure reasons to specific recovery strategies:

| Failure Type | Strategy | Action |
|---|---|---|
| Bank downtime / timeout | SCHEDULE_RETRY | Wait 15 mins, auto-retry |
| Insufficient funds | UPI_FALLBACK | Send alternate UPI link |
| Expired card / CVV | MANDATE_UPDATE | Ask to update card details |
| Unknown | GENERAL_OUTREACH | Polite retry request |

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini 3.6 Flash |
| Payments | Razorpay Payment Links API |
| Styling | Custom CSS |

---

## 🔧 How to Run Locally

### Prerequisites

- Node.js installed
- Razorpay Test API Keys
- Supabase project with failed_payments and recovery_audit tables
- Google Gemini API Key

### Step 1: Clone the repository

    git clone https://github.com/YOUR_USERNAME/recoverflow.git
    cd recoverflow

### Step 2: Set up the Frontend

    cd Recoverflow
    npm install

Create a .env file inside the Recoverflow folder and paste your credentials:

   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_SUPABASE_URL="https://ilqivmyvtmhqwxguogpa.supabase.co"
   VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlscWl2bXl2dG1ocXd4Z3VvZ3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNjg1MjQsImV4cCI6MjEwMzY0NDUyNH0.pssNRNovJjobPrDlHJ7Zf77yd7bUMebgBHHE0loFR00"

### Step 3: Set up the Backend

    cd ../server
    npm install

Create a .env file inside the server folder and paste your credentials:

   PORT=3001
   RAZORPAY_KEY_ID=rzp_test_TXEXZCWeHhn3FA
   RAZORPAY_KEY_SECRET=rM9H147XevPPt1wi6leU8qsr

### Step 4: Run both servers

Terminal 1 (Backend):

    cd server
    node server.js

Terminal 2 (Frontend):

    cd Recoverflow
    npm run dev

Open http://localhost:5173 in your browser.

---

## Database Schema

### failed_payments table

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary Key |
| customer_name | text | Name of the customer |
| amount | numeric | Transaction amount |
| failure_reason | text | Root cause of failure |
| status | text | Current recovery status |
| customer_email | text | Customer email address |
| recovered_amount | numeric | Amount successfully restored |
| created_at | timestamp | Record creation timestamp |

### recovery_audit table

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary Key |
| payment_id | uuid | Foreign Key referencing failed payment |
| action | text | Agent strategy action executed |
| ai_message | text | Streamed AI WhatsApp message body |
| created_at | timestamp | Audit log timestamp |

---

##  Built By

**Ankur Kumar** — 2nd Year CSE Student, Chandigarh University (Uttar Pradesh Campus)  
Built for Razorpay Buildathon 2025

---

## ⚠️ Disclaimer

This project uses Razorpay in Test Mode. No real transactions are processed.