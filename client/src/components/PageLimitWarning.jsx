import {useEffect, useState} from 'react';
import {validateResumeLength} from '../utils/resumePageValidator';

const PageLimitWarning = ({resumePreviewRef, onOverflow}) => {
  const [status, setStatus] = useState({ isValid: true, overflow: 0 });

  useEffect(() => {
    const checkPageLimit = () => {
      if (!resumePreviewRef?.current) return;
      
      const templateElement = resumePreviewRef.current.querySelector('[data-resume-template]');
      if (!templateElement) return;
      
      const result = validateResumeLength(templateElement);
      setStatus(result);
      
      if (!result.isValid && onOverflow) {
        onOverflow(result);
      }
    };

    const timeoutId = setTimeout(checkPageLimit, 500);
    
    return () => clearTimeout(timeoutId);
  }, [resumePreviewRef, onOverflow]);

  if (status.isValid) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 max-w-md animate-bounce">
      <div className="flex items-center gap-3">
        <span className="text-3xl">⚠️</span>
        <div>
          <p className="font-bold text-lg">Resume Exceeds One Page!</p>
          <p className="text-sm mt-1">
            Content overflow: {Math.round(status.overflow)}px. Please reduce text to fit one page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageLimitWarning;
