
import React, { useState } from 'react';
import { refineContent } from '../services/geminiService';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  isTextArea?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({ value, onSave, className, isTextArea }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [isRefining, setIsRefining] = useState(false);

  const handleRefine = async () => {
    setIsRefining(true);
    const refined = await refineContent(localValue, "Make this more editorial, elegant, and punchy.");
    setLocalValue(refined);
    setIsRefining(false);
  };

  if (isEditing) {
    return (
      <div className="relative group">
        {isTextArea ? (
          <textarea
            className={`w-full bg-white/50 border border-brandRed/20 p-2 focus:outline-none focus:ring-1 focus:ring-brandRed ${className}`}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            rows={4}
          />
        ) : (
          <input
            className={`w-full bg-white/50 border border-brandRed/20 p-2 focus:outline-none focus:ring-1 focus:ring-brandRed ${className}`}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
          />
        )}
        <div className="flex gap-2 mt-2">
          <button 
            onClick={() => { onSave(localValue); setIsEditing(false); }}
            className="px-3 py-1 bg-brandRed text-white text-xs uppercase tracking-widest hover:bg-red-900 transition-colors"
          >
            Save
          </button>
          <button 
            onClick={handleRefine}
            disabled={isRefining}
            className="px-3 py-1 bg-cream border border-brandRed text-brandRed text-xs uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
          >
            {isRefining ? 'Refining...' : 'AI Refine'}
          </button>
          <button 
            onClick={() => { setLocalValue(value); setIsEditing(false); }}
            className="px-3 py-1 text-gray-400 text-xs uppercase tracking-widest"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group relative cursor-pointer hover:bg-white/30 transition-colors rounded p-1 -m-1 ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {value}
      <span className="absolute -top-4 right-0 opacity-0 group-hover:opacity-100 text-[10px] text-brandRed uppercase tracking-tighter transition-opacity bg-cream px-1">
        Click to Edit
      </span>
    </div>
  );
};

export default EditableText;
