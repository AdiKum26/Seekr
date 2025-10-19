import { Download, Eye, EyeOff, FileText, Trash2, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { ParsedCVData } from '../../utils/cvParser';
import { CVUpload } from './CVUpload';

interface ResumeViewerProps {
  resumeText: string;
  resumeName: string;
  onReplaceResume: (data: ParsedCVData) => void;
  onDeleteResume: () => void;
  useOpenAI?: boolean;
  onToggleOpenAI?: (useOpenAI: boolean) => void;
}

export function ResumeViewer({ resumeText, resumeName, onReplaceResume, onDeleteResume, useOpenAI, onToggleOpenAI }: ResumeViewerProps) {
  const [showFullText, setShowFullText] = useState(false);
  const [showReplaceForm, setShowReplaceForm] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReplace = (data: ParsedCVData) => {
    onReplaceResume(data);
    setShowReplaceForm(false);
  };

  const displayText = showFullText ? resumeText : resumeText.substring(0, 300) + '...';

  if (showReplaceForm) {
    return (
      <div className="space-y-4">
        <CVUpload
          onCVParsed={handleReplace}
          useOpenAI={useOpenAI}
          onToggleOpenAI={onToggleOpenAI}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowReplaceForm(false)}
          className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl py-3 flex items-center justify-center gap-2"
        >
          Cancel Replace
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Resume Display */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="text-green-600" size={24} />
            <div>
              <p className="font-medium text-gray-900">{resumeName}</p>
              <p className="text-sm text-gray-600">
                {resumeText.length} characters • {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Download resume text"
            >
              <Download size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFullText(!showFullText)}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title={showFullText ? "Show less" : "Show more"}
            >
              {showFullText ? <EyeOff size={18} /> : <Eye size={18} />}
            </motion.button>
          </div>
        </div>

        {/* Resume Text Preview */}
        <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {displayText}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowReplaceForm(true)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Upload size={16} />
            Replace Resume
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDeleteResume}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
