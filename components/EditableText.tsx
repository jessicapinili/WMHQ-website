import React from 'react';

interface EditableTextProps {
  value: string;
  onSave?: (newValue: string) => void;
  className?: string;
  isTextArea?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({ value, className }) => {
  // Converted to static text to remove Gemini API dependency and editing state overhead.
  return (
    <span className={className}>
      {value}
    </span>
  );
};

export default EditableText;
