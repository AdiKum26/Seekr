import { Briefcase, Clock, DollarSign, GraduationCap, MapPin, SlidersHorizontal, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";
import { Badge } from "../components/ui/Badge";

const allOpportunities = [
  {
    id: 1,
    type: "internship",
    title: "Software Engineering Intern - Cloud Infrastructure",
    company: "Microsoft",
    location: "Redmond, WA",
    salary: "$45-55/hr",
    match: 95,
    aiRecommended: true,
    image: "https://images.unsplash.com/photo-1653539465770-2d7120d830bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwd29ya2luZyUyMGxhcHRvcHxlbnwxfHx8fDE3NjA3MzUyNTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    deadline: "5 days",
    tags: ["Remote", "Visa Sponsorship", "Housing"]
  },
  {
    id: 2,
    type: "research",
    title: "AI Research Assistant - Natural Language Processing",
    company: "UW Paul G. Allen School",
    location: "Seattle, WA",
    salary: "$25/hr",
    match: 92,
    aiRecommended: true,
    image: "https://images.unsplash.com/photo-1606206873764-fd15e242df52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMGxhYm9yYXRvcnl8ZW58MXx8fHwxNzYwNzc1MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    deadline: "12 days",
    tags: ["On-campus", "Research", "Publication"]
  },
  {
    id: 3,
    type: "internship",
    title: "Product Management Intern",
    company: "Amazon",
    location: "Seattle, WA",
    salary: "$42-50/hr",
    match: 88,
    aiRecommended: false,
    image: "https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzYwODE1MzExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    deadline: "8 days",
    tags: ["Hybrid", "Relocation"]
  },
  {
    id: 4,
    type: "research",
    title: "Robotics Lab Research Position",
    company: "UW Robotics Lab",
    location: "Seattle, WA",
    salary: "$22/hr",
    match: 85,
    aiRecommended: true,
    image: "https://images.unsplash.com/photo-1606206873764-fd15e242df52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMGxhYm9yYXRvcnl8ZW58MXx8fHwxNzYwNzc1MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    deadline: "15 days",
    tags: ["On-campus", "Hands-on"]
  },
  {
    id: 5,
    type: "internship",
    title: "Data Science Intern",
    company: "Meta",
    location: "Menlo Park, CA",
    salary: "$50-60/hr",
    match: 90,
    aiRecommended: true,
    image: "https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzYwODE1MzExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    deadline: "10 days",
    tags: ["Relocation", "Visa Sponsorship"]
  },
  {
    id: 6,
    type: "research",
    title: "Bioinformatics Research Assistant",
    company: "UW Medicine",
    location: "Seattle, WA",
    salary: "$24/hr",
    match: 82,
    aiRecommended: false,
    image: "https://images.unsplash.com/photo-1606206873764-fd15e242df52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMGxhYm9yYXRvcnl8ZW58MXx8fHwxNzYwNzc1MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    deadline: "20 days",
    tags: ["Healthcare", "Research"]
  }
];

export function OpportunitiesPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Opportunities", icon: Briefcase },
    { id: "internship", label: "Internships", icon: Briefcase },
    { id: "research", label: "Research", icon: GraduationCap },
  ];

  const filteredOpportunities = selectedFilter === "all"
    ? allOpportunities
    : allOpportunities.filter(opp => opp.type === selectedFilter);

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="mb-2">Opportunities</h1>
        <p className="text-gray-600">
          {filteredOpportunities.length} opportunities matched to your profile
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="flex gap-2 flex-1">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  selectedFilter === filter.id
                    ? "bg-[var(--university-primary)] text-white shadow-lg"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-[var(--university-primary)]"
                }`}
              >
                <Icon size={16} />
                {filter.label}
              </motion.button>
            );
          })}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 flex items-center gap-2 hover:border-[var(--university-primary)] transition-colors"
        >
          <SlidersHorizontal size={16} />
          More Filters
        </motion.button>
      </motion.div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOpportunities.map((opp, index) => (
          <motion.div
            key={opp.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white rounded-3xl overflow-hidden border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <ImageWithFallback
                src={opp.image}
                alt={opp.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* AI Badge */}
              {opp.aiRecommended && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-purple-500/90 backdrop-blur-sm text-white rounded-full text-sm">
                  <Sparkles size={14} />
                  AI Match
                </div>
              )}

              {/* Match percentage */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-sm">{opp.match}% match</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Clock size={14} />
                  <span className="text-sm">{opp.deadline}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="mb-2 group-hover:text-[var(--university-primary)] transition-colors">
                {opp.title}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Briefcase size={16} />
                  {opp.company}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin size={16} />
                  {opp.location}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <DollarSign size={16} />
                  {opp.salary}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {opp.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-[var(--university-primary)] to-[var(--university-secondary)] text-white rounded-xl py-2.5"
                >
                  View Details
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Save
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
