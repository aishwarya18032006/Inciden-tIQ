LIVE  LINK : https://inciden-t-iq.vercel.app

#  IncidentIQ

### AI-Powered Incident Intelligence & Root Cause Analysis Platform

IncidentIQ is an intelligent incident analysis platform that helps developers and IT managers quickly identify root causes, generate structured RCA reports, and streamline incident management workflows using advanced AI models.

---

##  Overview

Modern software systems generate large volumes of logs, deployment changes, and incident data. Manually investigating these incidents is time-consuming and error-prone.

IncidentIQ automates this process by analyzing:

* Incident Timelines
* Error Logs
* Git Diffs

and generating detailed AI-powered Root Cause Analysis (RCA) reports with confidence scoring, severity assessment, and actionable recommendations.

---

#  System Architecture

![System Architecture](Project/Diagrams/System_Architecture.jpeg)

---

#  AI Multi-Agent RCA Flow

![AI Agent Flow](Project/Diagrams/MultiAgent_WorkFlow.jpeg)

---

#  User Workflow

![User Flow](Project/Diagrams/UserWorkFlow.jpeg)

---

#  Features

## Developer Module

* Incident Analysis
* Timeline Submission
* Error Log Analysis
* Git Diff Analysis
* AI RCA Generation
* PDF Report Export
* Email Report Sharing
* RCA History Tracking
* Submit Reports to IT Manager
* AI Copilot Assistant

## IT Manager Module

* Review Submitted Reports
* Approve / Reject RCA Reports
* Monitor Developer Submissions
* Track Incident Resolution Status
* AI Assisted Report Understanding

---

#  AI Provider Stack

IncidentIQ uses a multi-provider AI architecture:

### Primary Models

* Gemini 2.5 Flash
* Groq Llama 3.3 70B
* DeepSeek V3 (OpenRouter)
* Claude Sonnet (OpenRouter)

### AI Capabilities

* Root Cause Detection
* Timeline Correlation
* Log Analysis
* Git Change Impact Analysis
* Severity Classification
* Confidence Scoring
* Automated RCA Generation

---

#  Technology Stack

## Frontend

* React.js
* Vite
* Framer Motion
* CSS3

## Backend

* Node.js
* Express.js

## Database

* SQLite

## Authentication

* JWT Authentication
* Secure Cookies

## AI Integration

* Gemini 2.5 Flash
* Groq Llama 3.3 70B
* DeepSeek V3
* Claude Sonnet

## Additional Services

* PDFKit
* Nodemailer
* Tesseract.js
* Sharp

---

# 📂 Project Structure

```text
IncidentIQ/
├── backend/
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── incidentsController.js
│   │   └── reportsController.js
│   ├── routes/
│   │   ├── ai.js
│   │   ├── auth.js
│   │   ├── incidents.js
│   │   └── reports.js
│   ├── services/
│   │   └── aiService.js
│   ├── database/
│   │   └── index.js
│   ├── incidentiq.db (SQLite)
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── GlobalChatbot.jsx
    │   │   └── layout/
    │   │       ├── Layout.jsx
    │   │       ├── Sidebar.jsx
    │   │       └── TopNav.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DeveloperDashboard.jsx
    │   │   ├── ManagerDashboard.jsx
    │   │   ├── ManagerAnalytics.jsx
    │   │   ├── CreateIncident.jsx
    │   │   ├── RCAReport.jsx
    │   │   └── more...
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── styles (CSS/Tailwind)
    ├── public/
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```


---

#  Installation

Clone the repository:

```bash
git clone https://github.com/your-username/IncidentIQ.git
```

Install dependencies:

```bash
cd IncidentIQ

cd frontend
npm install

cd ../backend
npm install
```

---

#  Run the Application

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

---

#  RCA Report Output

IncidentIQ generates professional RCA reports containing:

* Incident Summary
* Timeline Analysis
* Error Analysis
* Git Diff Analysis
* Root Cause
* Impact Assessment
* Severity Classification
* Confidence Score
* Recommended Fixes
* Prevention Actions

Reports can be:

* Downloaded as PDF
* Shared via Email
* Submitted to IT Managers
* Stored in RCA History

---

#  Future Scope

* Kubernetes Integration
* Jira Integration
* GitHub Actions Integration
* Slack Notifications
* Historical Incident Correlation
* Predictive Incident Analysis

---

# 👨‍💻 Team

Project Name:Tect Tetra
**Team Members : Aishwarya R | Sudarshan P | Nithiskumar N | Pradhakshini P

**Category:** AI-Powered Incident Intelligence Platform

---

#  License

This project is developed for educational, research, and hackathon purposes.
