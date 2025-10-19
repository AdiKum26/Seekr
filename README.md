# Seekr - AI Agent for UW Students

An intelligent AI career & research agent built specifically for University of Washington students — helping find research labs, on-campus jobs, internships, and scholarships instantly, and even auto-drafting professor outreach emails based on the student's real background.

## 🌟 Features

### 🎓 Opportunity Discovery (UW-Focused)

- **Research Labs & Prof Outreach** — AI finds active professors + auto-drafts tailored outreach emails
- **On-Campus Jobs & Paid Roles** — filters F-1/CPT eligible positions automatically
- **Scholarships & Fellowships** — academic + financial support opportunities

### 🤖 AI Career & Research Agent

- **Conversational** — not just a chatbot
- **Understands resume, projects, constraints**
- **Asks at most ONE clarifying question**
- **Generates real outbound-ready emails with confidence**
- **Future: Multi-Agent (Jobs Agent, Professor Agent, Mentor Agent, Scholarship Agent)**

### 📊 Personalized Dashboard (Upcoming)

- **Track research applications & follow-up reminders**
- **Deadline alerts for scholarships & internships**
- **Outreach history & AI recommendations**

### 🔎 Future Academic Expansion

- **Course planning & AI academic routing**
- **RateMyProfessor + GPA distribution integration**
- **Degree requirement alignment**

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS (UW branding)
- **Animations:** Framer Motion
- **AI Backend:** AWS Bedrock (Claude 3.7) — Agent Orchestration
- **Build Tool:** Vite
- **Type Safety:** Strict TypeScript

## 📁 Project Structure

```
seekr/
├── src/
│   ├── components/
│   │   ├── ui/              # Button, Badge, Progress, etc.
│   │   ├── chat/            # AI chat interface
│   │   ├── dashboard/       # Application tracking widgets
│   │   └── shared/          # Image/Error handlers, etc.
│   ├── pages/               # Main page routes
│   ├── types/               # Strongly typed models
│   ├── styles/              # Tailwind + theme config
│   ├── App.tsx              # Root component
│   └── main.tsx             # App entry point
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
git clone <repository-url>
cd seekr
npm install
npm run dev
```

Then visit: http://localhost:3000

## 🔮 Future Enhancements

- **AI-powered cold email execution (auto-send)**
- **UW MyPlan + Handshake + RMP data fusion**
- **F-1/CPT real-time compliance filtering**
- **Bedrock memory — remembers academic goals over sessions**
- **React Native mobile app**
- **AI calendar planning ("I have 3 midterms next week, help me plan")**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/feature-name`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to GitHub (`git push origin feature-name`)
5. Open a Pull Request

## 📄 License

MIT License

## 👥 Authors

**Seekr Dev Team** — Built at the University of Washington

---

*Made with determination to eliminate "email 20 professors and pray for a reply" forever.*