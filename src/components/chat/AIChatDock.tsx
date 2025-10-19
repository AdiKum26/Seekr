import { FileText, Loader2, Mail, Mic, Send, Sparkles, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "../../lib/supabase";
import { Message } from "../../types";
import { AIAvatar } from "./AIAvatar";
// 🔧 PRODUCTION INTEGRATION - AWS Lambda + Bedrock AI Pipeline

// Mock research opportunities data
const MOCK_OPPORTUNITIES = [
  {
    id: "1",
    title: "Natural Language Processing Research Assistant",
    focus: "Large Language Models and Neural Machine Translation",
    subfield: "NLP",
    emails: ["prof.nlp@uw.edu", "nlp.lab@cs.washington.edu"],
    url: "https://nlp.cs.washington.edu/opportunities",
    description: "Working on cutting-edge research in transformer architectures and multilingual models.",
    professor: "Dr. Sarah Chen",
    department: "Computer Science & Engineering"
  },
  {
    id: "2",
    title: "Human-Computer Interaction Lab Position",
    focus: "Accessible Computing and User Experience Research",
    subfield: "HCI",
    emails: ["hci.lab@uw.edu", "prof.ux@cs.washington.edu"],
    url: "https://hci.cs.washington.edu/research",
    description: "Exploring innovative interfaces for users with diverse abilities and needs.",
    professor: "Dr. Michael Torres",
    department: "Human Centered Design & Engineering"
  },
  {
    id: "3",
    title: "Robotics and AI Integration Research",
    focus: "Autonomous Systems and Computer Vision for Robotics",
    subfield: "Robotics",
    emails: ["robotics@uw.edu", "prof.vision@cs.washington.edu"],
    url: "https://robotics.cs.washington.edu/join",
    description: "Developing intelligent robots capable of real-world navigation and manipulation.",
    professor: "Dr. Jennifer Park",
    department: "Paul G. Allen School of Computer Science"
  },
  {
    id: "4",
    title: "Conversational AI and Dialogue Systems",
    focus: "Multi-turn dialogue and conversational understanding",
    subfield: "NLP",
    emails: ["dialogue.lab@uw.edu"],
    url: "https://dialogue.cs.washington.edu",
    description: "Building next-generation conversational agents with context awareness.",
    professor: "Dr. Alex Martinez",
    department: "Linguistics & Computer Science"
  },
  {
    id: "5",
    title: "Human-Robot Interaction Research",
    focus: "Social robotics and collaborative systems",
    subfield: "HCI",
    emails: ["hri.lab@uw.edu", "social.robotics@cs.washington.edu"],
    url: "https://hri.cs.washington.edu",
    description: "Investigating how humans and robots can work together effectively.",
    professor: "Dr. Emily Zhang",
    department: "Computer Science & Engineering"
  }
];

// OpenAI API Key (in production, this would be in environment variables)
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-api-key-here';

interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  major?: string;
  gpa?: string;
  grad_year?: number;
  parsed_skills?: { [key: string]: boolean };
  parsed_interests?: { [key: string]: boolean };
  bio?: string;
}

export function AIChatDock() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  // Listen for external triggers to open the chat
  useEffect(() => {
    const handleOpenChat = (event: CustomEvent) => {
      const message = event.detail?.message || '';
      if (message) {
        setInputValue(message);
      }
      setIsExpanded(true);
    };

    window.addEventListener('openAIchat' as any, handleOpenChat);
    return () => window.removeEventListener('openAIchat' as any, handleOpenChat);
  }, []);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content: "Hi! I'm your Seekr AI mentor. I can help you find research opportunities, draft emails to professors, and guide your academic journey. What would you like help with today?",
      actions: [
        { icon: Sparkles, label: "Find Opportunities", description: "Match with research positions" },
        { icon: Mail, label: "Draft Email", description: "Create personalized outreach" },
        { icon: FileText, label: "Review Profile", description: "Check your profile completeness" }
      ]
    }
  ]);

  // Initialize user session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          setSessionId(uuidv4());
          console.log('AIChatDock: User session initialized', { userId: user.id, sessionId });
        }
      } catch (error) {
        console.error('AIChatDock: Error initializing session:', error);
      }
    };

    initializeSession();
  }, []);

  // Match opportunities based on user profile
  const matchOpportunities = async (profile: UserProfile) => {
    console.log('Matching opportunities for profile:', profile);

    // Extract skills and interests as arrays
    const skills = profile.parsed_skills ? Object.keys(profile.parsed_skills) : [];
    const interests = profile.parsed_interests ? Object.keys(profile.parsed_interests) : [];
    const allKeywords = [...skills, ...interests].map(k => k.toLowerCase());

    console.log('User keywords:', allKeywords);

    // Score each opportunity based on keyword matches
    const scoredOpportunities = MOCK_OPPORTUNITIES.map(opp => {
      let score = 0;
      const oppText = `${opp.title} ${opp.focus} ${opp.subfield} ${opp.description}`.toLowerCase();

      allKeywords.forEach(keyword => {
        if (oppText.includes(keyword)) {
          score++;
        }
      });

      // Boost score for major-related opportunities
      if (profile.major && oppText.includes(profile.major.toLowerCase())) {
        score += 2;
      }

      return { ...opp, score };
    });

    // Sort by score and return top 3
    const topMatches = scoredOpportunities
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    console.log('Top matches:', topMatches);
    return topMatches;
  };

  // Call OpenAI API for intelligent drafting
  const callOpenAIDrafting = async (
    profile: UserProfile,
    matches: any[],
    userMessage: string
  ) => {
    console.log('Calling OpenAI for drafting...');

    const systemPrompt = `You are Seekr AI, an expert academic advisor and research opportunity matcher for University of Washington students.

Your role is to:
1. Analyze student profiles and match them with relevant research opportunities
2. Draft personalized, professional emails to professors
3. Provide actionable guidance for academic success

You have access to the student's profile including their skills, interests, major, and academic standing.

When drafting emails, ensure they are:
- Professional yet personable
- Highlight relevant skills and experiences
- Show genuine interest in the research
- Include a clear call-to-action
- Keep it concise (200-250 words)

Always return responses in a conversational, helpful tone.`;

    const userPrompt = `Student Profile:
- Name: ${profile.full_name || 'Student'}
- Email: ${profile.email || 'N/A'}
- Major: ${profile.major || 'N/A'}
- GPA: ${profile.gpa || 'N/A'}
- Expected Graduation: ${profile.grad_year || 'N/A'}
- Skills: ${profile.parsed_skills ? Object.keys(profile.parsed_skills).join(', ') : 'N/A'}
- Interests: ${profile.parsed_interests ? Object.keys(profile.parsed_interests).join(', ') : 'N/A'}
- Bio: ${profile.bio || 'N/A'}

Top Matched Opportunities:
${matches.map((m, i) => `
${i + 1}. ${m.title}
   - Professor: ${m.professor}
   - Department: ${m.department}
   - Focus: ${m.focus}
   - Contact: ${m.emails[0]}
`).join('\n')}

User Request: ${userMessage}

Based on the user's request, provide a helpful response. If they're asking to draft an email or reach out to professors, generate a complete, personalized email they can send. If they're asking about opportunities, provide a summary of the matches and why they're good fits.

Format your response naturally and conversationally.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I encountered an error generating a response.';

      console.log('OpenAI response received:', aiResponse);
      return aiResponse;

    } catch (error) {
      console.error('OpenAI API Error:', error);

      // Fallback response if OpenAI fails
      const isDraftRequest = userMessage.toLowerCase().includes('draft') ||
                            userMessage.toLowerCase().includes('email') ||
                            userMessage.toLowerCase().includes('write');

      if (isDraftRequest && matches.length > 0) {
        const topMatch = matches[0];
        return `Great! I've found ${matches.length} excellent research opportunities that align with your profile. Let me draft an email for the top match:

**${topMatch.title}** with ${topMatch.professor}

---

**Subject:** Interested in ${topMatch.subfield} Research Opportunity

Dear ${topMatch.professor},

My name is ${profile.full_name || 'a student'}, and I'm currently a ${profile.major || 'Computer Science'} major at the University of Washington (GPA: ${profile.gpa || 'N/A'}, Expected graduation: ${profile.grad_year || 'N/A'}).

I am writing to express my strong interest in joining your research group, specifically the work on ${topMatch.focus}. Your research aligns perfectly with my interests in ${profile.parsed_interests ? Object.keys(profile.parsed_interests).slice(0, 2).join(' and ') : 'this field'}.

I have experience with ${profile.parsed_skills ? Object.keys(profile.parsed_skills).slice(0, 3).join(', ') : 'relevant technologies'}, and I'm eager to contribute to your lab's innovative work. ${profile.bio || 'I am passionate about pushing the boundaries of what\'s possible in this field.'}

Would you have any availability in the coming weeks to discuss potential research opportunities? I would love to learn more about your current projects and how I might contribute.

Thank you for your time and consideration.

Best regards,
${profile.full_name || 'Student'}
${profile.email || ''}

---

Would you like me to help you customize this email or find more opportunities?`;
      } else {
        return `🎯 **I found ${matches.length} excellent research opportunities for you:**

${matches.map((m, i) => `
**${i + 1}. ${m.title}**
👨‍🏫 Professor: ${m.professor}
🏫 Department: ${m.department}
🔬 Focus: ${m.focus}
⭐ Match Score: ${m.score} relevant skills/interests
📧 Contact: ${m.emails[0]}
`).join('\n')}

✨ **Why these are perfect for you:**
These opportunities align well with your background in **${profile.major || 'your field'}** and your interests in **${profile.parsed_interests ? Object.keys(profile.parsed_interests).slice(0, 2).join(' and ') : 'research'}**.

💡 **Ready to take action?**
• Click "Quick Apply" to generate a personalized application email
• Click "Draft Email" to create a professional outreach message
• Or ask me to help you with a specific opportunity!`;
      }
    }
  };

  // Enhanced handleSend with full workflow
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    if (!userId) {
      console.error('No user ID available');
      return;
    }

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Step 1: Fetch user profile from Supabase
      console.log('Fetching user profile...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw new Error(`Failed to fetch profile: ${profileError.message}`);
      }

      console.log('User profile loaded:', profile);

      // Step 2: Match opportunities
      const matchedOpportunities = await matchOpportunities(profile);

      // Step 3: Call AI for intelligent response
      // 🔧 PRODUCTION OPTION - Use AWS Lambda + Bedrock AI Pipeline (COMMENTED OUT - AWS QUOTA PENDING)
      // const productionResponse = await generateResearchEmailsWithAI(profile);
      // const aiResponse = formatProductionResponse(productionResponse);

      // 🎯 CURRENT: Use OpenAI for hackathon demo
      const aiResponse = await callOpenAIDrafting(profile, matchedOpportunities, inputValue);

      // Step 4: Add AI response to messages
      const aiMessage: Message = {
        id: messages.length + 2,
        type: "ai",
        content: aiResponse
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error in handleSend:', error);

      const errorMessage: Message = {
        id: messages.length + 2,
        type: "ai",
        content: "I apologize, but I encountered an error processing your request. Please make sure your profile is complete and try again."
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quick actions (Quick Apply, Draft Email)
  const handleQuickAction = async (action: 'apply' | 'draft') => {
    if (isLoading || !userId) return;

    setIsLoading(true);

    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw new Error(`Failed to fetch profile: ${profileError.message}`);
      }

      // Get matched opportunities
      const matchedOpportunities = await matchOpportunities(profile);

      if (matchedOpportunities.length === 0) {
        throw new Error('No opportunities found to apply for');
      }

      // 🔧 PRODUCTION OPTION - Use AWS Lambda + Bedrock AI Pipeline (COMMENTED OUT - AWS QUOTA PENDING)
      // const productionResponse = await generateResearchEmailsWithAI(profile, {
      //   maxOpportunities: 1,
      //   focusAreas: ['Computer Science', 'AI/ML', 'Research'],
      //   professorRanking: 'all'
      // });
      // const emailResponse = formatProductionEmailResponse(productionResponse.opportunities[0]);

      // 🎯 CURRENT: Use OpenAI for hackathon demo
      const topOpportunity = matchedOpportunities[0];
      const emailResponse = await generatePersonalizedEmail(profile, topOpportunity, action);

      // Add the email response to messages
      const emailMessage: Message = {
        id: messages.length + 1,
        type: "ai",
        content: emailResponse
      };

      setMessages(prev => [...prev, emailMessage]);

    } catch (error) {
      console.error('Error in handleQuickAction:', error);

      const errorMessage: Message = {
        id: messages.length + 1,
        type: "ai",
        content: "I apologize, but I encountered an error generating your email. Please make sure your profile is complete and try again."
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate personalized email for a specific opportunity
  const generatePersonalizedEmail = async (
    profile: UserProfile,
    opportunity: any,
    action: 'apply' | 'draft'
  ) => {
    const systemPrompt = `You are Seekr AI, an expert academic advisor. Generate a professional, personalized email for a student to reach out to a professor about a research opportunity.

Guidelines:
- Make it professional yet personable
- Highlight relevant skills and experiences from their profile
- Show genuine interest in the specific research area
- Include a clear call-to-action
- Keep it concise (200-250 words)
- Include a compelling subject line
- Be specific about the research opportunity

Format your response as:
Subject: [Subject Line]

Dear [Professor Name],

[Email Body]

Best regards,
[Student Name]
[Student Email]

---
Professor Contact: [Email Address]
Research Focus: [Focus Area]
Department: [Department]`;

    const userPrompt = `Student Profile:
- Name: ${profile.full_name || 'Student'}
- Email: ${profile.email || 'student@uw.edu'}
- Major: ${profile.major || 'Computer Science'}
- GPA: ${profile.gpa || 'N/A'}
- Expected Graduation: ${profile.grad_year || 'N/A'}
- Skills: ${profile.parsed_skills ? Object.keys(profile.parsed_skills).join(', ') : 'N/A'}
- Interests: ${profile.parsed_interests ? Object.keys(profile.parsed_interests).join(', ') : 'N/A'}
- Bio: ${profile.bio || 'N/A'}

Research Opportunity:
- Title: ${opportunity.title}
- Professor: ${opportunity.professor}
- Department: ${opportunity.department}
- Focus: ${opportunity.focus}
- Contact Email: ${opportunity.emails[0]}

Action Requested: ${action === 'apply' ? 'Quick Apply - Generate a compelling application email' : 'Draft Email - Generate a professional outreach email'}

Please generate a personalized email that highlights why this student is a great fit for this specific research opportunity.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 600
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const emailContent = data.choices[0]?.message?.content || 'I apologize, but I encountered an error generating the email.';

      return emailContent;

    } catch (error) {
      console.error('OpenAI Email Generation Error:', error);

      // Fallback email template
      const fallbackEmail = `Subject: Interest in ${opportunity.subfield} Research Opportunity - ${profile.full_name || 'Student'}

Dear ${opportunity.professor},

My name is ${profile.full_name || 'Student'}, and I'm currently a ${profile.major || 'Computer Science'} major at the University of Washington (GPA: ${profile.gpa || 'N/A'}, Expected graduation: ${profile.grad_year || 'N/A'}).

I am writing to express my strong interest in joining your research group, specifically the work on ${opportunity.focus}. Your research aligns perfectly with my interests in ${profile.parsed_interests ? Object.keys(profile.parsed_interests).slice(0, 2).join(' and ') : 'this field'}.

I have experience with ${profile.parsed_skills ? Object.keys(profile.parsed_skills).slice(0, 3).join(', ') : 'relevant technologies'}, and I'm eager to contribute to your lab's innovative work. ${profile.bio || 'I am passionate about pushing the boundaries of what\'s possible in this field.'}

Would you have any availability in the coming weeks to discuss potential research opportunities? I would love to learn more about your current projects and how I might contribute.

Thank you for your time and consideration.

Best regards,
${profile.full_name || 'Student'}
${profile.email || 'student@uw.edu'}

---
Professor Contact: ${opportunity.emails[0]}
Research Focus: ${opportunity.focus}
Department: ${opportunity.department}`;

      return fallbackEmail;
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(true)}
            className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-[var(--university-primary)] to-[var(--university-secondary)] shadow-2xl flex items-center justify-center z-50 group"
            style={{
              boxShadow: "0 10px 40px var(--glow-color)"
            }}
          >
            <AIAvatar size="md" animated={false} />

            {/* Notification badge */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
            >
              3
            </motion.div>

            {/* Pulse effect */}
            <motion.div
              animate={{
                scale: [1, 1.5],
                opacity: [0.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              className="absolute inset-0 rounded-full bg-[var(--university-primary)]"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded chat panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-8 bottom-8 w-96 h-[600px] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--university-primary)] to-[var(--university-secondary)] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AIAvatar size="sm" animated={true} />
                <div>
                  <h3 className="text-white">Seekr AI Mentor</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white/80 text-xs">Active</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(false)}
                className="text-white/80 hover:text-white"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] ${
                    message.type === "user"
                      ? "bg-[var(--university-primary)] text-white rounded-2xl rounded-br-sm"
                      : "bg-white text-gray-900 rounded-2xl rounded-bl-sm border border-gray-200 shadow-sm"
                  } p-4`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>

                    {/* Action buttons for AI messages */}
                    {message.actions && (
                      <div className="mt-4 space-y-2">
                        {message.actions.map((action, index) => {
                          const Icon = action.icon;
                          return (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full bg-white rounded-xl p-3 flex items-start gap-3 text-left shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                            >
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--university-primary)] to-[var(--university-secondary)] flex items-center justify-center flex-shrink-0">
                                <Icon size={16} className="text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-900 font-medium">{action.label}</p>
                                <p className="text-xs text-gray-600">{action.description}</p>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gray-100 rounded-2xl p-3 flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
                  placeholder={isLoading ? "AI is thinking..." : "Ask me anything..."}
                  disabled={isLoading}
                  className="flex-1 bg-transparent outline-none text-sm disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  <Mic size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: isLoading ? 1 : 1.1 }}
                  whileTap={{ scale: isLoading ? 1 : 0.9 }}
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[var(--university-primary)] to-[var(--university-secondary)] text-white w-8 h-8 rounded-xl flex items-center justify-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </motion.button>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2 mt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickAction('apply')}
                  disabled={isLoading}
                  className="flex-1 bg-purple-500/10 text-purple-600 rounded-lg px-3 py-2 text-xs flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Zap size={12} />
                  Quick Apply
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickAction('draft')}
                  disabled={isLoading}
                  className="flex-1 bg-blue-500/10 text-blue-600 rounded-lg px-3 py-2 text-xs flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Mail size={12} />
                  Draft Email
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
