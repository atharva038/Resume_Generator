import {validateFieldLength} from '../utils/resumePageValidator';

const CharacterCounter = ({section, field, value, className = ''}) => {
  const validation = validateFieldLength(section, field, value);
  
  if (!validation.limit) return null;

  const percentage = (validation.current / validation.limit) * 100;
  const isNearLimit = percentage > 80;
  const isOverLimit = percentage > 100;

  return (
    <div className={`text-xs mt-1 flex items-center gap-2 ${className}`}>
      <span className={`font-medium ${
        isOverLimit ? 'text-red-600' : 
        isNearLimit ? 'text-yellow-600' : 
        'text-gray-500'
      }`}>
        {validation.current}/{validation.limit}
      </span>
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
        <div 
          className={`h-full transition-all ${
            isOverLimit ? 'bg-red-500' : 
            isNearLimit ? 'bg-yellow-500' : 
            'bg-green-500'
          }`}
          style={{width: `${Math.min(percentage, 100)}%`}}
        />
      </div>
    </div>
  );
};

export default CharacterCounter;
