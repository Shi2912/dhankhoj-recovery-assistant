# DhanKhoj (धनखोज)
### AI Recovery Assistant for India's Unclaimed Wealth

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v24-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![GovTech](https://img.shields.io/badge/GovTech-Public%20Empowerment-138808.svg)](#)

> **Important Regulatory Notice:** DhanKhoj does **NOT** hold, transfer, collect, or guarantee recovery of funds. It acts strictly as an informational discovery and guidance tool. All claims must be verified and completed directly through the relevant official financial institution or regulatory authority (e.g. RBI UDGAM, IEPF Authority, EPFO).

---

## 1. Project Overview

Over **₹1.4+ Lakh Crore** (more than \$17 Billion USD) in unclaimed financial assets lies dormant across Indian banks, provident funds, insurance companies, and mutual funds.

For millions of ordinary Indian families, senior citizens, and legal heirs, reclaiming this money is notoriously difficult because:
- Family members have passed away without leaving complete paperwork.
- Indian names are written with multiple spelling permutations (e.g., *Mohd.* vs *Mohammed* vs *Md.*, initials like *M. Iqbal*, or honorifics like *Late Shri*).
- People change jobs and forget inoperative Provident Fund (EPFO) accounts from decades ago.
- Unclaimed records are siloed across disconnected public databases (RBI DEA Fund, MCA IEPF, EPFO Inoperative Accounts).

**DhanKhoj** bridges this divide by providing an intuitive, senior-citizen-friendly AI recovery assistant equipped with **multilingual voice input**, **passbook OCR**, **Indian-name fuzzy matching**, **cross-database discovery**, and **dynamic claim guidance**.

---

## 2. Problem Statement & Solution

| The Challenge | How DhanKhoj Solves It |
| :--- | :--- |
| **Spelling Mismatches** across decades-old records (*Mohd Iqbal* vs *Mohammed Iqbal*) | Rapid-TokenScorer fuzzy matching algorithm combining Levenshtein, Jaro-Winkler, Token Sort, and abbreviation expansion tailored for Indian names. |
| **Low Technical Literacy / Senior Citizens** struggle with complex search forms | Plain-language conversational input ("Tell us what you remember") + browser voice recognition in **English, Hindi, and Tamil**. |
| **Paper Documents** in physical drawers (old passbooks, PF slips, dividend warrants) | Local in-browser & server Optical Character Recognition (**OCR** with Tesseract.js) to extract names, accounts, and banks. |
| **Fragmented Records** across banks and ministries | Unified adapter architecture searching across **RBI UDGAM**, **IEPF (Shares & Dividends)**, and **EPFO**. |
| **Complex Legal Claim Processes** for deceased relatives | 5-step interactive claim roadmap + dynamic document checklist + downloadable **official claim discovery PDF summary**. |
| **Predatory Fraud & Scammers** demanding "recovery fees" | Strict **Trust & Safety Center** with masked identifiers, zero credentials/OTPs, and warnings against advance-fee scams. |

---

## 3. Key Features

- 🎙️ **Multilingual Voice Search:** Speak in English, Hindi (हिन्दी), or Tamil (தமிழ்) via the Web Speech API with seamless text fallback.
- 💬 **Conversational Entity Extractor:** Type natural sentences like *"My grandfather Mohammed Iqbal had an SBI account around 1998 in Chennai"* and watch DhanKhoj automatically extract the name, bank, year, location, and relationship.
- 📷 **Document OCR:** Upload photos of vintage passbooks, fixed deposit receipts, or PF slips to extract information without manual typing. Includes 4 one-click demo presets!
- 🧠 **Indian Name Normalization & Fuzzy Engine:**
  - Expands Indian abbreviations (*Mohd/Md* $\rightarrow$ *Mohammed*, *Kr* $\rightarrow$ *Kumar*, *Prsd* $\rightarrow$ *Prasad*, *Chndr* $\rightarrow$ *Chandra*).
  - Handles initials (*M. Iqbal* $\leftrightarrow$ *Mohammed Iqbal*, *S.K. Sharma* $\leftrightarrow$ *Suresh Kumar Sharma*).
  - Strips honorifics (*Sri, Shri, Smt, Late, Mr, Mrs, Dr*).
  - Phonetic transliteration tolerance (*Laxmi* $\leftrightarrow$ *Lakshmi*, *f* $\leftrightarrow$ *ph*, *v* $\leftrightarrow$ *w*).
- 📊 **Explainable AI Scoring:** Transparent breakdown with weighted factors:
  - **Name Similarity:** 50%
  - **Institution Alignment:** 15%
  - **Approximate Year Proximity:** 10%
  - **Location / Region Match:** 10%
  - **Asset Category Match:** 10%
  - **Family / Context Prior:** 5%
- 👨‍👩‍👧‍👦 **Deceased Relative & Legal Heir Flow:** Specific legal guidance, death certificate checklist, and succession certificates for family searches.
- 📄 **Downloadable Claim Summary PDF:** Generates a professional, formatted PDF summary packet with verification details and checklists via `jsPDF`.
- 🛡️ **Trust & Anti-Fraud Center:** Educates citizens against recovery scams. DhanKhoj never asks for passwords, fees, or OTPs.
- 🗄️ **Admin Console & CSV Ingestion:** Live registry analytics, record counts, and CSV dataset importer with automatic name normalization.

---

## 4. Tech Stack

- **Frontend:** React 18, Vite 6, Tailwind CSS, Lucide React icons, jsPDF.
- **Backend:** Node.js (ES Modules), Express 4, Multer.
- **Database:** Zero-dependency persistent JSON/SQLite-compatible storage with automatic seeding.
- **AI & NLP:**
  - Token Sort / Set Ratio + Jaro-Winkler + Levenshtein fuzzy engine.
  - Indian financial conversational query entity extractor.
  - Tesseract.js optical character recognition engine.
  - Web Speech API for multilingual voice transcription.

---

## 5. Project Structure

```
unclaimed-asset-assistant/
│
├── client/                     # Frontend React + Vite Application
│   ├── public/                 # Static assets & icons
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx              # Navigation & demo mode badge
│   │   │   ├── Footer.jsx              # GovTech footer & official portals
│   │   │   ├── TrustBanner.jsx         # Citizen trust guarantee
│   │   │   ├── ProcessingAnimation.jsx # Multi-stage AI pipeline visualizer
│   │   │   ├── ConfidenceBadge.jsx     # Color-coded match tiers
│   │   │   ├── ScoreBreakdownModal.jsx # Explainable AI modal
│   │   │   ├── VoiceInputButton.jsx    # Web Speech API in EN/HI/TA
│   │   │   ├── DocumentUploader.jsx    # Drag-and-drop OCR uploader
│   │   │   ├── ExtractedChipsEditor.jsx# Editable entity chips
│   │   │   └── SampleScenariosBar.jsx  # 1-click judge presets
│   │   ├── pages/              # Application views
│   │   │   ├── LandingPage.jsx         # Hero & introduction
│   │   │   ├── SearchAssistantPage.jsx # Conversational search
│   │   │   ├── DocumentUploadPage.jsx  # OCR passbook review
│   │   │   ├── ResultsPage.jsx         # Ranked results dashboard
│   │   │   ├── ResultDetailPage.jsx    # Deep match explanation
│   │   │   ├── ClaimGuidancePage.jsx   # 5-step roadmap & checklist
│   │   │   ├── SearchHistoryPage.jsx   # Local search audit log
│   │   │   ├── TrustSafetyPage.jsx     # Anti-fraud education
│   │   │   └── AdminDashboardPage.jsx  # Metrics & CSV dataset importer
│   │   ├── services/
│   │   │   ├── api.js                  # Frontend API client
│   │   │   └── pdfGenerator.js         # jsPDF document builder
│   │   ├── utils/
│   │   │   └── speechRecognition.js    # Browser speech recognition wrapper
│   │   ├── App.jsx             # Main application orchestrator
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind styles & tricolor gradient
│   ├── index.html              # HTML entry point
│   ├── vite.config.js          # Vite config with backend proxy (:5000)
│   ├── tailwind.config.js      # Indian GovTech theme & typography
│   └── package.json            # Client dependencies
│
├── server/                     # Backend Node.js Express API
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── data-sources/       # Pluggable registry adapters
│   │   │   ├── base-adapter.js         # Standard adapter contract
│   │   │   ├── rbi-adapter.js          # RBI UDGAM / DEA Fund
│   │   │   ├── iepf-adapter.js         # IEPF Shares & Dividends
│   │   │   ├── epfo-adapter.js         # EPFO Inoperative Accounts
│   │   │   └── index.js                # Multi-source aggregator
│   │   ├── db/
│   │   │   ├── database.js             # Persistent storage & query engine
│   │   │   └── seed.js                 # Database seeding CLI script
│   │   ├── matching/           # Core AI Fuzzy Matching Engine
│   │   │   ├── normalizer.js           # Indian name & title normalizer
│   │   │   ├── fuzzy.js                # Levenshtein, Jaro-Winkler, TokenSet
│   │   │   └── scorer.js               # Weighted explainable scorer
│   │   ├── nlp/
│   │   │   └── query-extractor.js      # Natural query entity extractor
│   │   ├── ocr/
│   │   │   └── ocr-service.js          # Tesseract.js OCR processor
│   │   ├── routes/
│   │   │   └── api.js                  # Express API routes
│   │   ├── services/
│   │   │   ├── search-service.js       # Search execution service
│   │   │   ├── claim-guidance-service.js # Dynamic checklist service
│   │   │   └── admin-service.js        # Stats & CSV dataset importer
│   │   ├── utils/
│   │   │   └── masker.js               # Privacy data masker
│   │   ├── config.js
│   │   └── index.js            # Express server entry point
│   ├── test-suite.js           # Comprehensive automated verification suite
│   ├── package.json            # Server dependencies
│   └── .env.example            # Server environment configuration
│
├── data/
│   ├── demo/                   # Realistic demonstration datasets
│   │   ├── rbi_unclaimed_deposits.json # Bank deposits (SBI, PNB, Canara, etc.)
│   │   ├── iepf_unclaimed_shares.json  # Shares/Dividends (Tata Motors, RIL, ITC)
│   │   └── epfo_unclaimed_pf.json      # Inoperative PF accounts (Ashok Leyland, SAIL)
│   └── imports/                # Directory for CSV imports
│
├── start-dev.js                # Cross-platform concurrent runner (Node-native)
├── .env.example                # Root environment example
├── .gitignore                  # Git ignore rules
├── package.json                # Root package with install & run scripts
└── README.md                   # Full documentation & setup guide
```

---

## 6. Installation & Execution Guide (VS Code on Windows)

The application is engineered to run seamlessly on **Windows PowerShell**, Command Prompt, macOS, or Linux without requiring paid APIs or global package installations.

### Step 1: Open the Project in VS Code
1. Launch **Visual Studio Code**.
2. Click **File $\rightarrow$ Open Folder...**
3. Select the `unclaimed-asset-assistant` folder.

### Step 2: Install Dependencies
Open a PowerShell terminal in VS Code (`Ctrl + ~`) and run:

```powershell
npm run install:all
```
*(This automatically installs packages for both `server/` and `client/` in a single command).*

### Step 3: Start Frontend and Backend Concurrently
Run:

```powershell
npm run dev
```

This starts:
- **Backend API Server:** `http://localhost:5000`
- **Frontend Vite Client:** `http://localhost:5173`

Open your browser to `http://localhost:5173`.

---

## 7. Alternative Manual Start (Individual Terminals)

If you prefer running the frontend and backend in separate terminals:

**Terminal 1 (Backend):**
```powershell
cd server
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```powershell
cd client
npm install
npm run dev
```

---

## 8. Verification & Automated Testing

A complete automated test suite is bundled in `server/test-suite.js`. It tests:
1. Database seeding from demo datasets
2. Conversational entity extraction (NLP)
3. Multi-source fuzzy search & score calculation
4. Indian initials and abbreviation matching (*S.K. Sharma* $\leftrightarrow$ *Suresh Kumar Sharma*)
5. OCR preset extraction
6. Dynamic claim guidance & legal heir checklists
7. CSV dataset ingestion & normalization

To run the verification suite:

```powershell
cd server
node test-suite.js
```

---

## 9. Hackathon Demo Scenarios for Judges

The application includes **4 preconfigured demo scenarios** located on both the Landing Page and the Search Assistant for rapid 1-click evaluation:

### 🎯 Scenario 1: Fuzzy Name Matching (The Master Test)
- **Input:** *"My grandfather Mohammed Iqbal had an SBI account around 1998 in Chennai."*
- **What to observe:**
  - AI extracts: Name: *Mohammed Iqbal*, Bank: *SBI*, Year: *1998*, Location: *Chennai*, Relation: *Grandparent*.
  - Matches records registered under **Mohammed Iqbal**, **Mohd Iqbal**, and **Muhammad Iqbal** with **92% Strong Possible Match**.
  - Cross-source discovery finds both **State Bank of India** deposits and **EPFO inoperative accounts** (Ashok Leyland Chennai).
  - Click **"How was this calculated?"** to see the 6-factor mathematical breakdown.

### 🎯 Scenario 2: Indian Initials & Deceased Legal Heir Flow
- **Input:** *"Searching for my late father Suresh Kumar Sharma who had a PNB account in Delhi around 1995"*
- **What to observe:**
  - Recognizes abbreviation *S.K. Sharma* as matching *Suresh Kumar Sharma*.
  - Enables **Deceased / Legal Heir Guidance Mode**.
  - Dynamic checklist automatically includes **Death Certificate**, **Succession Certificate / Legal Heir Certificate**, and **Heir NOC affidavits**.

### 🎯 Scenario 3: Phonetic Transliteration Tolerance
- **Input:** *"Lakshmi Narayanan had a Canara Bank deposit around 2002 in Bengaluru"*
- **What to observe:**
  - Matches against database record *Laxmi Narayan* using phonetic soundex rules.

### 🎯 Scenario 4: Old Passbook OCR to Claim Summary
- Go to **Document OCR** tab.
- Click **"Vintage SBI Savings Passbook (1998)"** or upload your own passbook picture.
- Click **Extract Information with OCR**.
- View extracted editable chips $\rightarrow$ click **Search** $\rightarrow$ view details $\rightarrow$ click **Download Official Claim Summary (PDF)**.
- Opens a clean, professional, official-looking discovery summary ready for branch presentation!

---

## 10. How the Matching Engine Works

DhanKhoj does **NOT** use simple exact SQL string matching. The matching engine operates in three pipeline stages:

```
Raw Query / Document Text
         ↓
1. Name Normalizer
   - Strip Indian honorifics (Shri, Smt, Late, Mr, Dr, etc.)
   - Expand abbreviations (Mohd/Md → Mohammed, Kr → Kumar, Prsd → Prasad)
   - Phonetic canonicalization (Laxmi → Lakshmi, v/w, ph/f)
   - Extract tokens & initials
         ↓
2. Fuzzy Comparison Pipeline
   - Token Set Ratio (handles subset names & tokens)
   - Token Sort Ratio (handles word order permutations)
   - Jaro-Winkler (rewards matching prefixes)
   - Levenshtein Distance (captures typo distance)
   - Initial-to-Name heuristic (M. → Mohammed, S.K. → Suresh Kumar)
         ↓
3. Weighted Scoring & Classification
   - Name Similarity: 50%
   - Institution: 15%
   - Year Range: 10%
   - Location: 10%
   - Asset Type: 10%
   - Context / Family: 5%
   - Classifies into Strong (90-100), Likely (75-89), Possible (60-74), Weak (<60)
```

---

## 11. Connecting Future Live Government Data Sources

DhanKhoj uses a pluggable adapter architecture. Each regulatory source implements `BaseDataSourceAdapter`:

```javascript
class CustomAdapter extends BaseDataSourceAdapter {
  constructor() {
    super('RBI_UDGAM', 'RBI UDGAM API', 'Reserve Bank of India');
  }

  // Real REST API or CSV sync endpoint
  async search(criteria) {
    // const response = await fetch('https://api.rbi.gov.in/v1/udgam/search', { ... });
    // return response.json().map(r => this.normalize(r));
  }
}
```

New datasets from **SEBI SCORES**, **LIC of India (Unclaimed Policies)**, or **Post Office Savings Bank** can be plugged in by creating a new adapter in `server/src/data-sources/` without modifying the core matching engine or frontend UI.

---

## 12. Trust, Safety & Ethics

- **Zero Passwords or Credentials:** DhanKhoj never asks for passwords, PINs, or UPI IDs.
- **Zero OTP Requests:** We never send or solicit OTPs.
- **Zero Recovery Fees:** 100% free public utility.
- **Masked Data:** Account numbers, folio numbers, and UANs are masked for privacy (*\*\*\*\*-9821*).
- **Ephemeral OCR:** Uploaded documents are processed in memory and never persisted to disk.
- **Clear Demarcation:** Demo datasets are explicitly flagged with *"Demo Dataset — Not Government Records"*.

---

## 13. License

This project is licensed under the **MIT License**.
Developed for the National Financial Empowerment Hackathon.
