import { Search, Sparkles, Target, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const suggestionChips = [
  { icon: TrendingUp, label: "Software Engineering Internships", color: "bg-blue-500/10 text-blue-600" },
  { icon: Target, label: "Research Opportunities", color: "bg-purple-500/10 text-purple-600" },
  { icon: Sparkles, label: "Full Scholarships", color: "bg-amber-500/10 text-amber-600" },
];

export function HeroSection() {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleAskAI = () => {
    // Trigger the AI chat dock to open with the search value
    const event = new CustomEvent('openAIchat', {
      detail: { message: searchValue || "Help me find opportunities" }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--university-primary)] rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-20 right-1/4 w-96 h-96 bg-[var(--university-secondary)] rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Main headline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl mb-4 bg-gradient-to-r from-[var(--university-primary)] to-[var(--university-secondary)] bg-clip-text text-transparent">
            What are you seeking today?
          </h1>
          <p className="text-xl text-gray-600">
            Your personalized gateway to jobs, research, and scholarships — powered by AI agents.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div className={`relative bg-white rounded-2xl shadow-lg transition-all ${
            isFocused ? "shadow-2xl ring-2 ring-[var(--university-primary)]/20" : ""
          }`}
            style={{
              boxShadow: isFocused ? "0 20px 60px var(--glow-color)" : ""
            }}
          >
            <div className="flex items-center px-6 py-4">
              <Search className="text-gray-400 mr-3" size={24} />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search for opportunities, research positions, or scholarships..."
                className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAskAI}
                className="ml-3 px-6 py-2 bg-gradient-to-r from-[var(--university-primary)] to-[var(--university-accent)] text-white rounded-xl flex items-center gap-2"
              >
                <Sparkles size={16} />
                Ask AI
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Suggestion chips */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {suggestionChips.map((chip, index) => {
            const Icon = chip.icon;
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const event = new CustomEvent('openAIchat', {
                    detail: { message: `Find me ${chip.label.toLowerCase()}` }
                  });
                  window.dispatchEvent(event);
                }}
                className={`${chip.color} px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-sm`}
              >
                <Icon size={16} />
                {chip.label}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
