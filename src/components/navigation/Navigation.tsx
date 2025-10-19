import { Award, Briefcase, FlaskConical, Home, LogOut, User } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { AIAvatar } from "../chat/AIAvatar";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const { signOut } = useAuth();

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "opportunities", label: "Opportunities", icon: Briefcase },
    { id: "scholarships", label: "Scholarships", icon: Award },
    { id: "research", label: "Research", icon: FlaskConical },
    { id: "profile", label: "My Profile", icon: User }
  ];

  return (
    <motion.nav
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-screen w-20 bg-white/70 backdrop-blur-xl border-r border-gray-200/50 flex flex-col items-center py-6 z-40"
    >
      {/* Logo */}
      <div className="mb-8">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="cursor-pointer"
          onClick={() => onPageChange("home")}
        >
          <AIAvatar size="md" />
        </motion.div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center relative group transition-all ${
                isActive
                  ? "bg-[var(--university-primary)] text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={20} />

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--university-secondary)] rounded-r-full"
                />
              )}

              {/* Tooltip */}
              <div className="absolute left-20 bg-gray-900 text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Sign Out Button */}
      <div className="mt-auto">
        <motion.button
          onClick={signOut}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all group relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut size={20} />

          {/* Tooltip */}
          <div className="absolute left-20 bg-gray-900 text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            Sign Out
          </div>
        </motion.button>
      </div>
    </motion.nav>
  );
}
