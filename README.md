# 🌾 AGRO VISION

### **Smart Farming. Better Markets. Better Returns.**

> **From harvest to market — one intelligent ecosystem connecting the people who grow, aggregate, and buy India's food.**

[![Smart India Hackathon](https://img.shields.io/badge/Smart%20India%20Hackathon-SIH%202026-orange?style=for-the-badge)](https://www.sih.gov.in/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue?style=for-the-badge)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge)](https://nodejs.org/)
[![AI/ML](https://img.shields.io/badge/AI%2FML-Python-yellow?style=for-the-badge)](https://www.python.org/)
[![Database](https://img.shields.io/badge/Database-Supabase-black?style=for-the-badge)](https://supabase.com/)

---

## 🚜 The Idea

A farmer's journey does not end when the crop is harvested.

The real challenge begins **after the harvest**:

**Where should it be sold?**
**What is its quality?**
**What price can it realistically achieve?**
**Who is the right buyer?**
**How can multiple farmers combine their produce?**
**How can transactions become more transparent?**

**AGRO VISION** is designed to answer these questions through a single digital ecosystem.

Instead of treating farmers, FPOs and buyers as isolated systems, we connect them through an intelligent marketplace.

```text
                 🌱 FARMER
                    │
                    ▼
            📸 Produce Assessment
                    │
                    ▼
          🤖 AI + Market Intelligence
                    │
                    ▼
              🏢 FPO NETWORK
                    │
              Aggregate Produce
                    │
                    ▼
             📦 SMART LOTS
                    │
                    ▼
               🏪 BUYERS
                    │
                    ▼
          🤝 NEGOTIATION & DEAL
                    │
                    ▼
            🚚 TRANSACTION FLOW
                    │
                    ▼
             💰 FARMER RETURN
```

---

# 🎯 What We Are Solving

Traditional agricultural markets can involve fragmented information, uncertain pricing, limited market visibility and disconnected participants.

AGRO VISION approaches the problem as an **end-to-end value chain** rather than as a standalone marketplace.

### Our core principle:

> **Don't just help a farmer sell a crop. Help the farmer make a better selling decision.**

---

# 🧠 What Makes AGRO VISION Different?

Most platforms focus on one part of agriculture.

AGRO VISION brings multiple decision layers together:

| Layer           | What AGRO VISION Does                                 |
| --------------- | ----------------------------------------------------- |
| 🌾 Produce      | Farmer records crop, quantity and harvest information |
| 📸 Quality      | AI-assisted produce quality assessment                |
| 📈 Price        | Future price prediction and market intelligence       |
| 🧮 Returns      | Net-realisation calculation                           |
| 🏢 FPO          | Aggregates produce from multiple farmers              |
| 📦 Lots         | Creates structured aggregated lots                    |
| 🔎 Market       | Ranks potential markets                               |
| 🤝 Buyers       | Matches buyer requirements with available lots        |
| 💬 Deals        | Supports offers and negotiation                       |
| 🚚 Transactions | Tracks deal and delivery status                       |
| ⚖️ Trust        | Provides dispute and arbitration workflow             |

This creates a **connected agricultural decision system**, rather than simply another buying-and-selling website.

---

# 🔥 The AGRO VISION Journey

## 01 — 🌱 Farmer enters the ecosystem

A farmer creates a profile and provides basic information such as location and farming details.

The system maintains role-based access for different participants.

---

## 02 — 📦 Produce becomes digital

Farmers can submit their produce with information including:

* Crop / commodity
* Quantity
* Unit
* Harvest date
* Location
* Quality information
* Produce photographs
* Preferred FPO

The produce becomes a structured digital asset that can move through the marketplace.

---

## 03 — 🤖 Intelligence enters the decision

AGRO VISION introduces intelligent assistance instead of forcing farmers to make decisions using raw information.

### 📈 Future Price Prediction

The ML layer can estimate future commodity prices based on the selected commodity, market and prediction horizon.

The current implementation includes future-price prediction endpoints and a Python prediction engine.

### 📸 Quality Assessment

Produce can also pass through an AI-assisted quality assessment layer to generate quality information before marketplace aggregation.

### 💰 Net Realisation

The platform goes beyond the displayed selling price.

It can calculate expected **net realisation**, helping users think about the amount that remains after relevant costs.

---

# 🏢 04 — FPOs Become the Aggregation Layer

One farmer may have limited quantity.

Many farmers together can create a much stronger market offering.

AGRO VISION therefore uses the FPO as an important bridge between farmers and buyers.

```text
Farmer A ─┐
Farmer B ─┤
Farmer C ─┼──► FPO ───► Aggregated Lot ───► Buyer
Farmer D ─┤
Farmer E ─┘
```

Instead of every farmer independently negotiating with buyers, produce can be aggregated into organized lots.

The current backend explicitly implements produce aggregation and lot creation workflows.

---

# 🏪 05 — Buyers see organized supply

Buyers don't need to search through disconnected individual farmer listings.

They can interact with aggregated lots and procurement requirements.

The platform supports:

* Buyer requirements
* Lot matching
* Match scores
* Match rationale
* Offers
* Negotiation
* Deal conversion

This turns fragmented supply into a more structured procurement experience.

---

# 🤝 06 — From Offer → Deal → Delivery

AGRO VISION treats a transaction as a journey.

```text
Requirement
     ↓
Matching
     ↓
Offer
     ↓
Negotiation
     ↓
Accepted Deal
     ↓
Transaction
     ↓
In Transit
     ↓
Delivered
     ↓
Payment / Farmer Payout
```

The backend includes transaction status handling for deal, tracking and farmer payout states.

---

# ⚖️ 07 — Trust doesn't stop at the transaction

Real-world marketplaces need mechanisms for handling disagreements.

AGRO VISION includes a dispute-management layer where disputes can be raised, tracked and resolved through an administrative workflow.

This gives the platform a path beyond:

> **"We matched a buyer and seller."**

towards:

> **"We support the transaction lifecycle."**

---

# 🗺️ Market Intelligence

AGRO VISION can evaluate markets for a particular crop based on parameters such as:

* Crop
* Quantity
* Origin district
* Origin taluka
* Storage duration

The backend exposes a market-ranking workflow for this purpose.

### The goal:

**Don't ask only "Where can I sell?"**

Ask:

> **"Which market makes the most sense for this produce?"**

---

# 🧩 System Architecture

```text
                    ┌─────────────────────┐
                    │      FARMERS        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   REACT FRONTEND    │
                    │  TypeScript + Vite  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    NODE.JS API      │
                    │   Business Logic    │
                    └──────┬───────┬──────┘
                           │       │
                 ┌─────────┘       └──────────┐
                 ▼                            ▼
       ┌──────────────────┐        ┌──────────────────┐
       │   DATA LAYER     │        │   ML / AI LAYER  │
       │ Supabase + Data  │        │ Price Prediction │
       │    Services      │        │ Quality Analysis │
       └──────────────────┘        └──────────────────┘
                 │                            │
                 └─────────────┬──────────────┘
                               ▼
                    ┌─────────────────────┐
                    │  MARKET INTELLIGENCE│
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │        FPOs          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       BUYERS         │
                    └─────────────────────┘
```

The repository is structured around separate `client`, `server`, and `ml_service` components, reflecting this separation of concerns.

---

# 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express-style REST APIs
* Supabase integration

### Intelligence Layer

* Python
* ML-based price prediction
* Produce quality assessment
* Market intelligence algorithms

### Data

* Supabase
* Structured agricultural datasets
* Marketplace entities and transaction records

The frontend repository currently uses React + TypeScript + Vite and Tailwind configuration, while the project contains a dedicated Python ML service.

---

# 📂 Project Structure

```text
SIH/
│
├── client/
│   ├── public/
│   └── src/
│
├── server/
│   ├── data/
│   ├── database.js
│   ├── mlEngine.js
│   ├── server.js
│   ├── supabase.js
│   └── supabase_schema.sql
│
├── ml_service/
│   └── model_engine.py
│
├── package.json
└── .gitignore
```

---

# ⚡ Core API Capabilities

The backend currently includes API flows covering several stages of the agricultural marketplace.

### Authentication

```text
/api/auth/login
/api/auth/register
```

### ML Intelligence

```text
/api/ml/predict-future-price
/api/ml/predict-price
/api/ml/net-realisation
/api/ml/assess-quality
```

### Market Intelligence

```text
/api/market/prices
/api/market/rankings
```

### FPO

```text
/api/fpos/list
/api/fpo/create-lot
```

### Farmer

```text
/api/farmer/produce
/api/farmer/fpo-request
```

### Buyer

```text
/api/buyer/requirements
```

### Transactions

```text
/api/offers
/api/offers/:offerId/accept
/api/transactions/:txnId/status
```

### Dispute Management

```text
/api/disputes
/api/admin/disputes/:id/resolve
```

These workflows are implemented in the project's current server architecture.

---

# 🚀 Running the Project

## 1. Clone

```bash
git clone https://github.com/harshvardhanpandit447-ux/SIH.git
cd SIH
```

## 2. Install dependencies

```bash
npm install
```

Then install the frontend dependencies:

```bash
cd client
npm install
```

## 3. Start the frontend

```bash
npm run dev
```

## 4. Start the backend

From the server directory:

```bash
cd ../server
npm install
node server.js
```

> Configure your environment variables and Supabase credentials according to your local setup before using production-connected services.

---

# 🧪 Prototype Philosophy

AGRO VISION is built around a simple idea:

### **Technology should reduce uncertainty, not create another layer of complexity.**

That's why the platform connects information that is usually scattered across different decisions:

```text
PRICE
  +
QUALITY
  +
QUANTITY
  +
LOCATION
  +
MARKET
  +
BUYER DEMAND
        ↓
BETTER SELLING DECISION
```

---

# 🌟 Innovation Snapshot

### 🧠 Decision Intelligence

Not just data display — the system attempts to turn market information into actionable decisions.

### 📈 Forward-Looking Pricing

Price prediction adds a future-oriented layer instead of relying only on today's price.

### 🤖 Quality-Aware Marketplace

Produce quality can influence how produce is represented and evaluated.

### 🏢 FPO-Centric Aggregation

Multiple farmers can be combined into organized lots.

### 🔎 Market Ranking

The platform can evaluate potential markets rather than simply displaying market information.

### 🤝 Structured Buyer Matching

Buyer requirements can be matched with aggregated supply.

### ⚖️ Transaction Accountability

The workflow continues into delivery, payout and dispute management.

---

# 🇮🇳 Why This Matters

Agriculture is not just about production.

It is a chain:

```text
SEED
 ↓
CROP
 ↓
HARVEST
 ↓
QUALITY
 ↓
AGGREGATION
 ↓
MARKET
 ↓
BUYER
 ↓
TRANSPORT
 ↓
PAYMENT
```

A weakness anywhere in this chain can affect the final return.

**AGRO VISION attempts to connect the chain digitally.**

---

# 🔮 Future Roadmap

The prototype can evolve into a production-grade agricultural intelligence platform through:

* 📡 Live mandi-price integrations
* 🛰️ Satellite and weather intelligence
* 🌦️ Weather-aware selling recommendations
* 📱 Low-bandwidth / offline-first farmer experience
* 🗣️ Regional-language voice assistance
* 🔐 Stronger identity and verification systems
* 📊 Advanced demand forecasting
* 🚚 Logistics optimization
* 💳 Production-grade payment and escrow integrations
* 📈 Personalized crop-selling recommendations
* 🧠 Continuous ML model improvement using verified historical data

---

# 🏆 SIH Perspective

AGRO VISION was designed with a hackathon mindset:

> **Find the bottleneck. Connect the disconnected. Add intelligence where decisions matter.**

The goal is not to create another agriculture dashboard.

The goal is to create a **decision-support ecosystem around the agricultural value chain.**

---

# 👥 Team

### Team AGRO VISION

**Smart India Hackathon 2026**

Built with:

* 🌾 Agriculture at the center
* 🤖 AI/ML for intelligence
* 💻 Software for accessibility
* 📊 Data for decisions
* 🇮🇳 A vision for smarter agricultural markets

---

# 📌 Repository

**GitHub:**
https://github.com/harshvardhanpandit447-ux/SIH

---

## 💚 Built for the people who grow India.

### **AGRO VISION**

**Smart Farming. Better Markets. Better Returns.**

> *From a single harvest to a connected marketplace.*
