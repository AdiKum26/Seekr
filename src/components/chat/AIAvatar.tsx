import { Brain, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { AIAvatarProps } from "../../types";

export function AIAvatar({ size = "md", animated = true }: AIAvatarProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32
  };

  return (
    <motion.div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-[var(--university-primary)] to-[var(--university-secondary)] flex items-center justify-center relative overflow-hidden`}
      animate={animated ? {
        boxShadow: [
          "0 0 20px var(--glow-color)",
          "0 0 40px var(--glow-color)",
          "0 0 20px var(--glow-color)"
        ]
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ["-100%", "100%"]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Icon */}
      <div className="relative z-10">
        <Brain size={iconSizes[size]} className="text-white" />
      </div>

      {/* Sparkle effect */}
      <motion.div
        className="absolute top-1 right-1"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles size={iconSizes[size] / 2} className="text-yellow-300" />
      </motion.div>
    </motion.div>
  );
}
