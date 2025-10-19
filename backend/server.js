const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' ||
            file.mimetype.includes('wordprocessingml') ||
            file.originalname.endsWith('.doc') ||
            file.originalname.endsWith('.docx')) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
        }
    }
});

// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
});

// Extract text from PDF
async function extractTextFromPDF(buffer) {
    try {
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        throw new Error(`PDF parsing failed: ${error.message}`);
    }
}

// Extract text from Word document
async function extractTextFromWord(buffer) {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (error) {
        throw new Error(`Word document parsing failed: ${error.message}`);
    }
}

// Parse CV with OpenAI
async function parseCVWithOpenAI(text, useAI = false) {
    if (!useAI) {
        // Simple regex-based extraction for basic parsing
        const gpa = text.match(/GPA[:\s]*(\d+\.?\d*)/i)?.[1] ||
            text.match(/(\d+\.\d+)\s*GPA/i)?.[1];

        const major = text.match(/Bachelor[^.]*in\s+([A-Za-z\s]+)/i)?.[1] ||
            text.match(/Major[:\s]*([A-Za-z\s]+)/i)?.[1] ||
            'Computer Science';

        const graduationYear = text.match(/Graduat[ed|ion][:\s]*(\d{4})/i)?.[1] ||
            text.match(/Expected[:\s]*(\d{4})/i)?.[1] ||
            text.match(/Class of (\d{4})/i)?.[1] ||
            '2026';

        const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0];

        const phone = text.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/)?.[0];

        // Extract skills
        const skills = [];
        const commonSkills = [
            'Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'Git',
            'Machine Learning', 'Data Science', 'Web Development', 'Mobile Development',
            'Cloud Computing', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'MongoDB',
            'PostgreSQL', 'Redis', 'GraphQL', 'REST API', 'TypeScript', 'Angular',
            'Vue.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'TensorFlow',
            'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'HTML', 'CSS', 'SASS',
            'Bootstrap', 'Tailwind CSS', 'Figma', 'Photoshop', 'Illustrator'
        ];

        for (const skill of commonSkills) {
            if (text.toLowerCase().includes(skill.toLowerCase())) {
                skills.push(skill);
            }
        }

        return {
            text,
            gpa,
            major,
            graduationYear,
            skills: [...new Set(skills)],
            email,
            phone,
            full_name: text.match(/^([A-Za-z\s]+)/m)?.[1] || 'Unknown'
        };
    }

    // Use OpenAI for intelligent parsing
    try {
        console.log('Using OpenAI for intelligent CV parsing...');
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are an expert CV parser and career analyst. Analyze the resume text and extract comprehensive information.

IMPORTANT: Return ONLY valid JSON with these exact fields:

{
  "full_name": "Full name from resume",
  "email": "Email address if found",
  "phone": "Phone number if found",
  "location": "City, State/Country if mentioned",
  "gpa": "GPA if explicitly mentioned (format: X.XX)",
  "major": "Academic major/degree program",
  "graduationYear": "Expected graduation year (YYYY format)",
  "skills": ["Technical skills", "Programming languages", "Tools", "Frameworks"],
  "experience": ["Work experience entries with company and role"],
  "education": ["Education entries with institution and degree"],
  "projects": ["Notable projects with brief descriptions"],
  "summary": "Professional summary/bio (2-3 sentences highlighting key strengths and career goals)",
  "interests": ["Academic interests", "Career interests", "Hobbies if relevant"]
}

Guidelines:
- Extract ALL technical skills mentioned (programming languages, frameworks, tools, etc.)
- Create a compelling professional summary that highlights the person's strengths
- Include relevant interests that show career direction
- Be accurate to the resume content
- If information is missing, omit the field entirely
- Return ONLY the JSON object, no other text`
                },
                {
                    role: "user",
                    content: `Analyze this resume text and extract the information:\n\n${text}`
                }
            ],
            temperature: 0.2,
            max_tokens: 1500,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from OpenAI');
        }

        console.log('OpenAI response:', content);

        // Clean the response (remove any markdown formatting)
        const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const parsedData = JSON.parse(cleanedContent);

        console.log('Parsed data:', parsedData);

        return {
            text,
            ...parsedData
        };

    } catch (error) {
        console.error('OpenAI parsing error:', error);
        throw new Error(`OpenAI parsing failed: ${error.message}`);
    }
}

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'PDF Parser API is running!' });
});

app.post('/parse-resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { useAI } = req.body;
        const file = req.file;

        console.log(`Processing file: ${file.originalname}, Size: ${file.size} bytes, AI: ${useAI}`);

        let text;

        // Extract text based on file type
        if (file.mimetype === 'application/pdf') {
            text = await extractTextFromPDF(file.buffer);
        } else if (file.mimetype.includes('wordprocessingml') ||
            file.originalname.endsWith('.doc') ||
            file.originalname.endsWith('.docx')) {
            text = await extractTextFromWord(file.buffer);
        } else {
            return res.status(400).json({ error: 'Unsupported file type' });
        }

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'No text found in document' });
        }

        // Parse the extracted text
        const parsedData = await parseCVWithOpenAI(text, useAI === 'true');

        res.json({
            success: true,
            data: parsedData
        });

    } catch (error) {
        console.error('Error parsing resume:', error);
        res.status(500).json({
            error: 'Failed to parse resume',
            details: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`PDF Parser API running on http://localhost:${port}`);
});
