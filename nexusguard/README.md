# ⬡ NexusGuard

### Autonomous Agentic Compliance & Treasury Operating System

> **Built for the Programmable Money Hackathon — Track 2: Agentic Economy**

NexusGuard is an AI-powered operating system for remote creative/tech teams that uses multiple autonomous agents to handle escrow, compliance, payments, treasury, and yield automatically using USDC on [Arc Network](https://arc.network) (Circle's stablecoin L1).

![NexusGuard](https://img.shields.io/badge/Arc_Testnet-Live-blue) ![USDC](https://img.shields.io/badge/Gas_Token-USDC-green) ![ERC-8004](https://img.shields.io/badge/ERC--8004-Agent_Identity-purple) ![ERC-8183](https://img.shields.io/badge/ERC--8183-Job_Contracts-orange)

---

## 🎯 Hackathon Pitch

**Problem:** Remote creative/tech teams waste 30%+ of time on administrative tasks — managing escrow, chasing payments, generating invoices, ensuring compliance across jurisdictions, and tracking treasury.

**Solution:** NexusGuard deploys 5 specialized AI agents that autonomously handle the entire payment lifecycle:
1. **Guardian Agent** 🛡️ — Coordinates all agents, manages on-chain identity (ERC-8004)
2. **Escrow Agent** 🔒 — Creates & manages job contracts with USDC escrow (ERC-8183)
3. **Validator Agent** 🤖 — LLM-powered deliverable validation with on-chain reputation
4. **Treasury Agent** 💰 — Unified balance management, automated payments
5. **Compliance Agent** 📋 — Auto-generated invoices, tax rules (Vietnam + US)

**Why Arc?** USDC-native gas, sub-second finality, ERC-8004/8183 standards, and Circle's full-stack developer tools make Arc the ideal chain for programmable money operations.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│                  Next.js 15 Frontend                  │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────┐  │
│  │ Dashboard │  │ Auth Flow │  │ Circle App Kit   │  │
│  └──────────┘  └───────────┘  └──────────────────┘  │
└──────────────────────┬───────────────────────────────┘
                       │
┌──────────────────────┼───────────────────────────────┐
│              Supabase Backend                         │
│  ┌──────────┐  ┌─────┴─────┐  ┌──────────────────┐  │
│  │ Auth     │  │ PostgreSQL│  │ API Routes       │  │
│  └──────────┘  └───────────┘  └──────────────────┘  │
└──────────────────────┬───────────────────────────────┘
                       │
┌──────────────────────┼───────────────────────────────┐
│           AI Agent Orchestration Layer                │
│  ┌─────────┐ ┌──────┐ ┌─────────┐ ┌────────┐ ┌────┐│
│  │Guardian │ │Escrow│ │Validator│ │Treasury│ │Comp││
│  └────┬────┘ └──┬───┘ └────┬────┘ └───┬────┘ └──┬─┘│
└───────┼─────────┼──────────┼──────────┼─────────┼───┘
        │         │          │          │         │
┌───────┴─────────┴──────────┴──────────┴─────────┴───┐
│                Arc Testnet (Circle L1)                │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ ERC-8004 │  │ ERC-8183 │  │ USDC (Native Gas) │  │
│  │ Identity │  │ Jobs     │  │ 0x3600...0000     │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui |
| **Backend** | Supabase (Auth, PostgreSQL, RLS) |
| **Blockchain** | Arc Testnet (Chain ID: 5042002) |
| **Smart Contracts** | ERC-8004 (Agent Identity) + ERC-8183 (Job Contracts) |
| **Wallets** | Circle Developer-Controlled Wallets (SCA) |
| **SDK** | viem + @circle-fin/developer-controlled-wallets |
| **AI** | OpenAI GPT-4 (Validator Agent LLM scoring) |
| **Deploy** | Vercel (frontend) |

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- npm
- [Circle Developer Console](https://console.circle.com) account
- [Supabase](https://supabase.com) account
- [OpenAI](https://platform.openai.com) API key (for Validator Agent)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/nexusguard.git
cd nexusguard
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local` and fill in your credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Circle Developer-Controlled Wallets
CIRCLE_API_KEY=your-circle-api-key
CIRCLE_ENTITY_SECRET=your-entity-secret

# OpenAI (for Validator Agent)
OPENAI_API_KEY=your-openai-key

# Arc Testnet (pre-configured)
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
NEXT_PUBLIC_ARC_EXPLORER=https://testnet.arcscan.app
```

### 3. Set Up Circle Developer-Controlled Wallets

1. Go to [Circle Developer Console](https://console.circle.com)
2. Create an API key: **Keys → Create a key → API key → Standard Key**
3. Register your Entity Secret: [Follow this guide](https://developers.circle.com/wallets/dev-controlled/register-entity-secret)
4. Copy your API key and Entity Secret to `.env.local`

### 4. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration at `supabase/migrations/001_initial_schema.sql`
3. Copy your project URL and anon key to `.env.local`

### 5. Get Testnet USDC

1. Visit [Circle Faucet](https://faucet.circle.com/)
2. Select **Arc Testnet** as the network
3. Enter your wallet address (created when you first use the app)
4. Request testnet USDC

### 6. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing on Arc Testnet

### End-to-End Flow

1. **Register** — Create account with email/password
2. **Create Team** — Set up your team (auto-creates treasury wallet on Arc)
3. **Invite Members** — Add team members by email
4. **Create Job** — Post a job with USDC budget
5. **Fund Escrow** — Lock USDC in ERC-8183 job contract
6. **Submit Deliverable** — Provider submits work
7. **AI Validation** — Validator Agent scores the deliverable (LLM-based)
8. **Auto-Payment** — On approval, USDC released to provider
9. **Invoice Generated** — Compliance Agent auto-generates invoice with tax rules

### Verify On-Chain

All transactions are verifiable on the [Arc Testnet Explorer](https://testnet.arcscan.app):
- Agent registrations (ERC-8004 IdentityRegistry)
- Job lifecycle (ERC-8183 AgenticCommerce)
- USDC transfers
- Reputation feedback

---

## 📁 Project Structure

```
nexusguard/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   ├── (auth)/                   # Auth pages
│   │   ├── (dashboard)/              # Dashboard pages
│   │   └── api/                      # API routes
│   ├── components/
│   │   ├── layout/                   # Sidebar, Header
│   │   ├── dashboard/                # Stats, Activity, Charts
│   │   ├── jobs/                     # Job forms, cards, timeline
│   │   ├── team/                     # Member cards, invites
│   │   └── compliance/               # Invoices, tax
│   ├── lib/
│   │   ├── agents/                   # AI Agent system
│   │   ├── arc/                      # Arc chain + viem
│   │   ├── circle/                   # Circle SDK wrappers
│   │   ├── supabase/                 # Supabase clients
│   │   └── utils.ts                  # Utilities
│   └── types/                        # TypeScript types
├── supabase/
│   └── migrations/                   # Database schema
└── .env.local                        # Environment variables
```

---

## 🔑 Smart Contract Addresses (Arc Testnet)

| Contract | Address | Standard |
|----------|---------|----------|
| USDC | `0x3600000000000000000000000000000000000000` | Native ERC-20 (6 decimals) |
| IdentityRegistry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` | ERC-8004 |
| ReputationRegistry | `0x8004B663056A597Dffe9eCcC1965A193B7388713` | ERC-8004 |
| ValidationRegistry | `0x8004Cb1BF31DAf7788923b405b754f57acEB4272` | ERC-8004 |
| AgenticCommerce | `0x0747EEf0706327138c69792bF28Cd525089e4583` | ERC-8183 |

---

## 🤖 AI Agent Details

### Guardian Agent (ERC-8004 Registered)
- Orchestrates all other agents
- Monitors job lifecycle events
- Registered on-chain with verifiable identity

### Escrow Agent
- Creates ERC-8183 job contracts
- Manages USDC escrow (approve → fund → track)
- Handles milestone-based releases

### Validator Agent (LLM-Powered)
- Uses GPT-4 to score deliverables (0-100)
- Evaluates: completeness, quality, standards, requirements
- Score ≥ 70: approves and triggers payment
- Score < 70: rejects and returns escrow
- Records reputation on-chain via ERC-8004

### Treasury Agent
- Manages unified USDC balance
- Processes automated payments
- Tracks transaction history

### Compliance Agent
- Auto-generates invoices
- Applies tax rules (Vietnam VAT 10%, US 0% crypto)
- Provides tax summaries

---

## 🏆 Circle/Arc Integration Highlights

- ✅ **Arc Testnet** — Native deployment on Circle's L1
- ✅ **USDC as Gas** — All transactions paid in USDC
- ✅ **ERC-8004** — Agent Identity with on-chain reputation
- ✅ **ERC-8183** — Programmable Job Contracts with escrow
- ✅ **Developer-Controlled Wallets** — Invisible blockchain UX
- ✅ **Circle Gas Station** — Sponsored gas for users
- ✅ **Smart Contract Accounts (SCA)** — Account abstraction

---

## 📄 License

MIT License — Built with ❤️ for the Programmable Money Hackathon

---

**⬡ NexusGuard** — *Making compliance and treasury autonomous, so teams can focus on building.*
