# Seekr PDF Parser Backend

Professional backend service for parsing PDF and Word documents using AI.

## Features

- **PDF Parsing**: Extract text from PDF files using `pdf-parse`
- **Word Document Parsing**: Extract text from DOC/DOCX files using `mammoth`
- **AI-Powered Analysis**: Use OpenAI GPT-3.5-turbo for intelligent resume parsing
- **Fallback Parsing**: Regex-based extraction when AI is disabled
- **File Validation**: Size limits and type checking
- **CORS Enabled**: Ready for frontend integration

## API Endpoints

### POST `/parse-resume`
Parse a resume file (PDF, DOC, DOCX)

**Request:**
- `FormData` with `resume` file
- Optional `useAI` boolean parameter

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Full extracted text",
    "gpa": "3.85",
    "major": "Computer Science",
    "graduationYear": "2026",
    "skills": ["Python", "JavaScript", "React"],
    "email": "user@example.com",
    "phone": "(555) 123-4567",
    "full_name": "John Doe",
    "summary": "Brief professional summary",
    "projects": ["Project descriptions"],
    "experience": ["Work experience entries"],
    "education": ["Education entries"]
  }
}
```

## Installation

```bash
cd backend
npm install
npm start
```

## Usage

1. Start the backend server: `npm start`
2. The API will be available at `http://localhost:3001`
3. Upload files from the frontend React app

## Environment

- Node.js backend with Express
- OpenAI API integration
- Professional PDF/Word parsing libraries
- CORS enabled for frontend communication

## Error Handling

- File size validation (10MB limit)
- File type validation (PDF, DOC, DOCX only)
- Graceful error responses
- Detailed error logging
