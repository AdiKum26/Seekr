import { Award, Building2, Calendar, DollarSign, ExternalLink, Globe, GraduationCap, Search, Sparkles, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AIAvatar } from "../components/chat/AIAvatar";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  category: string;
  eligibility: string[];
  tags: string[];
  url: string;
  aiRecommended: boolean;
  description: string;
  applicants?: number;
}

const scholarships: Scholarship[] = [
  // UW-Specific Scholarships
  {
    id: "1",
    name: "Mary Gates Endowment for Students",
    provider: "University of Washington",
    amount: "Up to $10,000",
    deadline: "January 15, 2025",
    category: "uw-specific",
    eligibility: ["UW Students", "Research Projects", "Leadership"],
    tags: ["Research", "Leadership", "UW"],
    url: "https://www.washington.edu/marygates/",
    aiRecommended: true,
    description: "Provides funding for student leadership and research projects at UW.",
    applicants: 450
  },
  {
    id: "2",
    name: "Paul G. Allen School CSE Scholarships",
    provider: "UW Allen School",
    amount: "$2,000 - $10,000",
    deadline: "February 1, 2025",
    category: "uw-specific",
    eligibility: ["CSE Majors", "GPA 3.0+", "UW Students"],
    tags: ["Computer Science", "Engineering", "UW"],
    url: "https://www.cs.washington.edu/academics/ugrad/scholarships",
    aiRecommended: true,
    description: "Merit-based scholarships for computer science and engineering students.",
    applicants: 320
  },
  {
    id: "3",
    name: "UW Husky Promise",
    provider: "University of Washington",
    amount: "Full Tuition",
    deadline: "Rolling",
    category: "uw-specific",
    eligibility: ["Washington Residents", "Income ≤ 80% State Median"],
    tags: ["Need-Based", "Full Tuition", "WA Residents"],
    url: "https://www.washington.edu/huskypromise/",
    aiRecommended: false,
    description: "Guarantees tuition coverage for eligible Washington state students.",
    applicants: 2500
  },
  {
    id: "4",
    name: "UW College of Engineering Scholarships",
    provider: "UW Engineering",
    amount: "$1,000 - $15,000",
    deadline: "March 1, 2025",
    category: "uw-specific",
    eligibility: ["Engineering Majors", "Academic Merit", "UW Students"],
    tags: ["Engineering", "Merit-Based", "UW"],
    url: "https://www.engr.washington.edu/admission/scholarships",
    aiRecommended: true,
    description: "Various scholarships for students in the College of Engineering.",
    applicants: 680
  },
  {
    id: "5",
    name: "Foster School of Business Scholarships",
    provider: "UW Foster School",
    amount: "$2,500 - $20,000",
    deadline: "February 15, 2025",
    category: "uw-specific",
    eligibility: ["Business Majors", "Leadership", "Academic Excellence"],
    tags: ["Business", "Leadership", "UW"],
    url: "https://foster.uw.edu/academics/degree-programs/undergraduate-programs/admissions/scholarships/",
    aiRecommended: false,
    description: "Scholarships for undergraduate business students at Foster.",
    applicants: 410
  },

  // International Scholarships
  {
    id: "6",
    name: "Fulbright Foreign Student Program",
    provider: "U.S. Department of State",
    amount: "Full Funding",
    deadline: "October 15, 2025",
    category: "international",
    eligibility: ["International Students", "Graduate Level", "Academic Excellence"],
    tags: ["International", "Graduate", "Prestigious"],
    url: "https://foreign.fulbrightonline.org/",
    aiRecommended: true,
    description: "Prestigious program for graduate-level study and research in the U.S.",
    applicants: 10000
  },
  {
    id: "7",
    name: "MPOWER Financing Global Citizen Scholarship",
    provider: "MPOWER Financing",
    amount: "$2,000 - $10,000",
    deadline: "December 31, 2025",
    category: "international",
    eligibility: ["International Students", "DACA Students", "All Majors"],
    tags: ["International", "DACA", "No Cosigner"],
    url: "https://www.mpowerfinancing.com/scholarships/",
    aiRecommended: true,
    description: "Scholarships specifically for international and DACA students.",
    applicants: 3500
  },
  {
    id: "8",
    name: "DAAD Scholarship Database",
    provider: "German Academic Exchange",
    amount: "Varies",
    deadline: "Various",
    category: "international",
    eligibility: ["Study in Germany", "Research", "All Levels"],
    tags: ["Germany", "Research", "Exchange"],
    url: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/",
    aiRecommended: false,
    description: "Database for study and research opportunities in Germany.",
    applicants: 15000
  },

  // General Scholarships
  {
    id: "9",
    name: "Bold.org No-Essay Scholarship",
    provider: "Bold.org",
    amount: "$1,000 - $25,000",
    deadline: "Monthly",
    category: "general",
    eligibility: ["All Students", "No Essay Required"],
    tags: ["No Essay", "Monthly", "Easy Apply"],
    url: "https://bold.org/",
    aiRecommended: true,
    description: "Monthly no-essay scholarships with various amounts.",
    applicants: 50000
  },
  {
    id: "10",
    name: "Fastweb Scholarship Match",
    provider: "Fastweb",
    amount: "Varies",
    deadline: "Various",
    category: "general",
    eligibility: ["All Students", "Profile-Based Matching"],
    tags: ["Database", "Personalized", "Large Network"],
    url: "https://www.fastweb.com/",
    aiRecommended: false,
    description: "Large database matching students to thousands of scholarships.",
    applicants: 100000
  },
  {
    id: "11",
    name: "Niche $50,000 Scholarship",
    provider: "Niche.com",
    amount: "$2,000 - $50,000",
    deadline: "December 31, 2025",
    category: "general",
    eligibility: ["All Students", "No Essay Required"],
    tags: ["High Value", "No Essay", "Monthly Drawing"],
    url: "https://www.niche.com/colleges/scholarships/",
    aiRecommended: true,
    description: "Monthly $2,000 no-essay scholarship plus annual $50,000 grand prize.",
    applicants: 75000
  },
  {
    id: "12",
    name: "TheWashBoard Scholarships",
    provider: "Washington State Organizations",
    amount: "$500 - $10,000",
    deadline: "Various",
    category: "general",
    eligibility: ["Washington Residents", "Various Criteria"],
    tags: ["Washington State", "Local", "Community"],
    url: "https://washboard.org/",
    aiRecommended: true,
    description: "Comprehensive scholarship database for Washington state residents.",
    applicants: 12000
  }
];

export function ScholarshipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Scholarships", count: scholarships.length },
    { id: "uw-specific", label: "UW Scholarships", count: scholarships.filter(s => s.category === "uw-specific").length },
    { id: "international", label: "International", count: scholarships.filter(s => s.category === "international").length },
    { id: "general", label: "General & Databases", count: scholarships.filter(s => s.category === "general").length }
  ];

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = searchQuery === "" ||
      scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || scholarship.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalFunding = scholarships.reduce((sum, s) => {
    const amount = s.amount.match(/\d+,?\d*/)?.[0]?.replace(',', '');
    return sum + (amount ? parseInt(amount) : 0);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="mb-2">Scholarships & Financial Aid</h1>
        <p className="text-gray-600">
          AI-curated scholarships from UW-specific programs, international opportunities, and national databases
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Award className="text-white" size={20} />
            </div>
            <div>
              <p className="text-2xl">{scholarships.length}</p>
              <p className="text-sm text-gray-600">Available Scholarships</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <DollarSign className="text-white" size={20} />
            </div>
            <div>
              <p className="text-2xl">${(totalFunding / 1000).toFixed(0)}K+</p>
              <p className="text-sm text-gray-600">Total Funding</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <p className="text-2xl">{scholarships.filter(s => s.aiRecommended).length}</p>
              <p className="text-sm text-gray-600">AI Recommended</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div>
              <p className="text-2xl">8</p>
              <p className="text-sm text-gray-600">Deadlines This Month</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 space-y-4"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search scholarships by name, provider, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 rounded-xl border-gray-300 focus:border-[var(--university-primary)]"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-xl transition-all ${
                selectedCategory === category.id
                  ? "bg-[var(--university-primary)] text-white shadow-lg"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-[var(--university-primary)]"
              }`}
            >
              {category.label}
              <Badge className="ml-2 bg-white/20">{category.count}</Badge>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* AI Insights Banner */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl p-6 border border-purple-200/50"
      >
        <div className="flex items-start gap-4">
          <AIAvatar size="md" />
          <div className="flex-1">
            <h3 className="mb-2">Personalized Scholarship Matches</h3>
            <p className="text-gray-700 mb-4">
              Based on your profile (CS major, 3.75 GPA, research interests in AI), you're a strong candidate for <span className="font-semibold">7 scholarships</span> with deadlines in the next 60 days. Your profile matches best with the Mary Gates Endowment and Paul G. Allen School scholarships.
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[var(--university-primary)] text-white px-4 py-2 rounded-xl"
              >
                View My Matches
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border border-gray-200 px-4 py-2 rounded-xl"
              >
                Set Deadline Alerts
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scholarship Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredScholarships.map((scholarship, index) => (
          <motion.div
            key={scholarship.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3>{scholarship.name}</h3>
                  {scholarship.aiRecommended && (
                    <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">
                      <Sparkles size={12} className="mr-1" />
                      AI Match
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Building2 size={14} />
                    {scholarship.provider}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {scholarship.deadline}
                  </div>
                  {scholarship.applicants && (
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      {scholarship.applicants.toLocaleString()} applicants
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-4">{scholarship.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {scholarship.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Eligibility:</p>
                  <div className="flex flex-wrap gap-2">
                    {scholarship.eligibility.map((req, i) => (
                      <Badge key={i} className="bg-blue-500/10 text-blue-600 border-blue-200">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right ml-4">
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl px-4 py-3 mb-3">
                  <p className="text-sm text-gray-600">Award Amount</p>
                  <p className="text-xl text-green-600">{scholarship.amount}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.a
                href={scholarship.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-[var(--university-primary)] to-[var(--university-secondary)] text-white rounded-xl py-3 flex items-center justify-center gap-2"
              >
                Apply Now
                <ExternalLink size={16} />
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Save
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Share
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Resources */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-white rounded-3xl p-6 border border-gray-200/50 shadow-lg"
      >
        <h3 className="mb-4">Additional Scholarship Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="https://www.washington.edu/omsfa/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <GraduationCap className="text-[var(--university-primary)]" size={24} />
            <div>
              <p className="font-medium">UW Office of Merit Scholarships</p>
              <p className="text-sm text-gray-600">Prestigious merit-based awards</p>
            </div>
            <ExternalLink className="ml-auto text-gray-400" size={16} />
          </a>

          <a href="https://www.washington.edu/financialaid/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <DollarSign className="text-[var(--university-primary)]" size={24} />
            <div>
              <p className="font-medium">UW Financial Aid Office</p>
              <p className="text-sm text-gray-600">Comprehensive financial aid guidance</p>
            </div>
            <ExternalLink className="ml-auto text-gray-400" size={16} />
          </a>

          <a href="https://www.iefa.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <Globe className="text-[var(--university-primary)]" size={24} />
            <div>
              <p className="font-medium">IEFA International Aid</p>
              <p className="text-sm text-gray-600">Aid for international students</p>
            </div>
            <ExternalLink className="ml-auto text-gray-400" size={16} />
          </a>

          <a href="https://scholarships.collegeboard.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <Search className="text-[var(--university-primary)]" size={24} />
            <div>
              <p className="font-medium">College Board Scholarship Search</p>
              <p className="text-sm text-gray-600">6,000+ scholarship programs</p>
            </div>
            <ExternalLink className="ml-auto text-gray-400" size={16} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
