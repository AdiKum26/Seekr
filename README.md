# Seekr - AI-Powered Academic Platform

An intelligent platform that helps students discover courses, internships, research opportunities, and scholarships using AI-powered recommendations.

## 🌟 Features

### 🎓 Course Explorer
- **AI-Powered Recommendations** - Personalized course suggestions based on your major, interests, and academic performance
- **RateMyProfessor Integration** - Direct links and embedded professor ratings
- **Comprehensive Course Data**:
  - Grade distributions and GPA averages
  - Enrollment statistics and availability
  - Difficulty ratings and workload estimates
  - Student highlights and reviews
  - Meeting times and locations

### 💼 Opportunity Matching
- **Smart Matching Algorithm** - Get matched with internships and research positions (with match percentages)
- **Deadline Tracking** - Never miss an opportunity with countdown timers
- **Multi-Source Aggregation** - Opportunities from companies, research labs, and university programs

### 💬 AI Chat Assistant
- **Conversational Interface** - Ask questions and get instant help
- **Actionable Suggestions** - AI provides buttons for quick actions (apply, email professors, etc.)
- **Proactive Notifications** - Get alerted about new opportunities and deadlines

### 🎯 Dashboard
- **Progress Tracking** - Monitor your applications and interview pipeline
- **Scholarship Alerts** - Get notified about closing scholarship deadlines
- **Professor Outreach** - AI-generated email drafts for research positions

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom university theming
- **Animations**: Framer Motion (motion/react)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Type Safety**: TypeScript with strict mode

## 📁 Project Structure

```
seekr/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (Badge, Progress)
│   │   ├── chat/            # AI chat components (AIAvatar, AIChatDock)
│   │   ├── dashboard/       # Dashboard cards and widgets
│   │   └── shared/          # Shared utilities (ImageWithFallback)
│   ├── pages/               # Page components (ClassesPage)
│   ├── types/               # TypeScript type definitions
│   ├── hooks/               # Custom React hooks (future)
│   ├── utils/               # Utility functions (future)
│   ├── styles/              # Global styles and themes
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Seekr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Customization

### University Branding

Customize the university colors in `src/styles/globals.css`:

```css
:root {
  --university-primary: #4b2e83;    /* Main brand color */
  --university-secondary: #85754d;   /* Secondary color */
  --university-accent: #b7a57a;      /* Accent color */
  --glow-color: rgba(75, 46, 131, 0.3); /* Glow effects */
}
```

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication and profiles
- [ ] Real-time data from university systems
- [ ] Advanced AI/ML recommendation engine
- [ ] Mobile app (React Native)
- [ ] Email integration for professor outreach
- [ ] Calendar integration for deadlines
- [ ] Analytics dashboard

## 📝 Type Safety

All components are fully typed with TypeScript. Type definitions can be found in `src/types/index.ts`:

- `Course` - Course information
- `Message` - Chat messages
- `Opportunity` - Job/internship opportunities
- `Scholarship` - Scholarship information
- `AIAvatarProps` - Component props

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name / Team

## 🙏 Acknowledgments

- University of Washington (for design inspiration)
- RateMyProfessor API
- Open source community

---

Made with ❤️ for students everywhere

