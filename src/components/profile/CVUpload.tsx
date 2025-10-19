import { AlertCircle, CheckCircle, FileText, Loader2, Sparkles, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ParsedResumeData, parseResume } from '../../services/api';

interface CVUploadProps {
  onCVParsed: (data: ParsedResumeData) => void;
  existingFileName?: string;
  useOpenAI?: boolean;
  onToggleOpenAI?: (useOpenAI: boolean) => void;
}

export function CVUpload({ onCVParsed, existingFileName, useOpenAI = false, onToggleOpenAI }: CVUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Uploading file to backend API:', file.name, 'Use AI:', useOpenAI);
      const parsedData = await parseResume(file, useOpenAI);
      onCVParsed(parsedData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CV');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="space-y-4">
      {/* OpenAI Toggle */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-600" size={18} />
          <span className="text-sm font-medium text-purple-800">Enhanced AI Parsing</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={useOpenAI}
            onChange={(e) => onToggleOpenAI?.(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${isDragActive
            ? 'border-[var(--university-primary)] bg-[var(--university-primary)]/5'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="text-[var(--university-primary)] animate-spin" size={32} />
            <p className="text-gray-600">Parsing your CV...</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="text-green-500" size={32} />
            <p className="text-green-600 font-medium">CV parsed successfully!</p>
            <p className="text-sm text-gray-600">Your profile has been updated with extracted information.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="text-gray-400" size={32} />
            <div>
              <p className="text-gray-600 mb-1">
                {isDragActive ? 'Drop your CV here' : 'Upload your CV'}
              </p>
              <p className="text-sm text-gray-500">
                Supports DOC and DOCX files up to 10MB
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF files will use demo data for parsing
              </p>
            </div>
          </div>
        )}
      </div>

      {existingFileName && !success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <FileText className="text-green-600" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium">{existingFileName}</p>
              <p className="text-xs text-gray-600">Uploaded</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <div>
              <p className="text-sm text-red-600 font-medium">Upload Failed</p>
              <p className="text-xs text-red-500">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <div>
              <p className="text-sm text-green-600 font-medium">CV Processed Successfully!</p>
              <p className="text-xs text-green-500">
                We've extracted information from your CV and updated your profile.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
