const API_BASE_URL = 'http://localhost:3001';

export interface ParsedResumeData {
  text: string;
  gpa?: string;
  major?: string;
  graduationYear?: string;
  skills?: string[];
  experience?: string[];
  education?: string[];
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  projects?: string[];
  full_name?: string;
  interests?: string[];
}

export async function parseResume(file: File, useAI: boolean = false): Promise<ParsedResumeData> {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('useAI', useAI.toString());

  try {
    const response = await fetch(`${API_BASE_URL}/parse-resume`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to parse resume');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    return response.ok;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
}
