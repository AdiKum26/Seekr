import { motion } from "motion/react";
import { useState } from "react";
import { AIChatDock } from "./components/chat/AIChatDock";
import { Navigation } from "./components/navigation/Navigation";
import { ClassesPage } from "./pages/ClassesPage";
import { HomePage } from "./pages/HomePage";
import { OpportunitiesPage } from "./pages/OpportunitiesPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ResearchPage } from "./pages/ResearchPage";
import { ScholarshipsPage } from "./pages/ScholarshipsPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "opportunities":
        return <OpportunitiesPage />;
      case "classes":
        return <ClassesPage />;
      case "scholarships":
        return <ScholarshipsPage />;
      case "research":
        return <ResearchPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-amber-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--university-primary)] rounded-full opacity-10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--university-secondary)] rounded-full opacity-10 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Navigation */}
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Main content */}
      <main className="ml-20 min-h-screen">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </main>

      {/* AI Chat Dock */}
      <AIChatDock />
    </div>
  );
}

