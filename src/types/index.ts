// Course related types
export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  section: string;
  sln: string;
  professor: string;
  professorRating: number;
  professorReviews: number;
  quarter: string;
  meetingTime: string;
  location: string;
  difficulty: number;
  averageGrade: string;
  gpaAverage: number;
  workload: string;
  rating: number;
  enrollment: number;
  maxEnrollment: number;
  credits: number;
  aiRecommended: boolean;
  tags: string[];
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
  highlights: string[];
  rmpUrl?: string;
}

// Chat related types
export interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  actions?: MessageAction[];
}

export interface MessageAction {
  icon: any;
  label: string;
  description: string;
}

// Dashboard related types
export interface Opportunity {
  id: number;
  title: string;
  company: string;
  location: string;
  match: number;
  aiRecommended: boolean;
  image: string;
  deadline: string;
}

export interface Scholarship {
  name: string;
  amount: string;
  deadline: string;
}

// Component prop types
export interface AIAvatarProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

