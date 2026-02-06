import {useState} from "react";
<<<<<<< HEAD
import {FIELD_LIMITS, validateFieldLength} from "../../utils/resumeLimits";
=======
import {FIELD_LIMITS, validateFieldLength} from "@/utils/resumeLimits";
import {useToggle} from "@/hooks";
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c

/**
 * Input field with character limit indicator
 */
export const LimitedInput = ({
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  fieldName,
  showLimit = true,
  maxLength,
  ...props
}) => {
<<<<<<< HEAD
  const [isFocused, setIsFocused] = useState(false);

  // Get limit from FIELD_LIMITS or use provided maxLength
  const limit = maxLength || FIELD_LIMITS[fieldName] || null;
  
=======
  const [isFocused, toggleFocused, setIsFocusedTrue, setIsFocusedFalse] =
    useToggle(false);

  // Get limit from FIELD_LIMITS or use provided maxLength
  const limit = maxLength || FIELD_LIMITS[fieldName] || null;

>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
  // Calculate validation
  const validation = limit ? validateFieldLength(fieldName, value) : null;

  const handleChange = (e) => {
    const newValue = e.target.value;
<<<<<<< HEAD
    
=======

>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
    // If there's a limit, enforce it
    if (limit && newValue.length > limit) {
      return; // Don't allow typing beyond limit
    }
<<<<<<< HEAD
    
    onChange(e);
  };

  const showCounter = showLimit && limit && (isFocused || (validation && validation.remaining < 50));
=======

    onChange(e);
  };

  const showCounter =
    showLimit &&
    limit &&
    (isFocused || (validation && validation.remaining < 50));
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${className} ${
          validation && !validation.valid
            ? "border-red-500 dark:border-red-400"
            : ""
        }`}
<<<<<<< HEAD
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
=======
        onFocus={setIsFocusedTrue}
        onBlur={setIsFocusedFalse}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
        maxLength={limit || undefined}
        {...props}
      />
      {showCounter && (
        <div
          className={`absolute right-2 top-2 text-xs font-medium px-2 py-1 rounded ${
            validation.remaining < 10
              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              : validation.remaining < 30
<<<<<<< HEAD
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
=======
                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
          }`}
        >
          {validation.remaining} left
        </div>
      )}
    </div>
  );
};

/**
 * Textarea with character limit indicator
 */
export const LimitedTextarea = ({
  value,
  onChange,
  placeholder,
  className = "",
  fieldName,
  showLimit = true,
  maxLength,
  rows = 3,
  ...props
}) => {
<<<<<<< HEAD
  const [isFocused, setIsFocused] = useState(false);

  // Get limit from FIELD_LIMITS or use provided maxLength
  const limit = maxLength || FIELD_LIMITS[fieldName] || null;
  
=======
  const [isFocused, toggleFocused, setIsFocusedTrue, setIsFocusedFalse] =
    useToggle(false);

  // Get limit from FIELD_LIMITS or use provided maxLength
  const limit = maxLength || FIELD_LIMITS[fieldName] || null;

>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
  // Calculate validation
  const validation = limit ? validateFieldLength(fieldName, value) : null;

  const handleChange = (e) => {
    const newValue = e.target.value;
<<<<<<< HEAD
    
=======

>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
    // If there's a limit, enforce it
    if (limit && newValue.length > limit) {
      return; // Don't allow typing beyond limit
    }
<<<<<<< HEAD
    
    onChange(e);
  };

  const showCounter = showLimit && limit && (isFocused || (validation && validation.remaining < 100));
=======

    onChange(e);
  };

  const showCounter =
    showLimit &&
    limit &&
    (isFocused || (validation && validation.remaining < 100));
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${className} ${
          validation && !validation.valid
            ? "border-red-500 dark:border-red-400"
            : ""
        }`}
<<<<<<< HEAD
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
=======
        onFocus={setIsFocusedTrue}
        onBlur={setIsFocusedFalse}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
        maxLength={limit || undefined}
        rows={rows}
        {...props}
      />
      {showCounter && (
        <div
          className={`absolute right-2 bottom-2 text-xs font-medium px-2 py-1 rounded backdrop-blur-sm ${
            validation.remaining < 20
              ? "bg-red-100/90 dark:bg-red-900/50 text-red-700 dark:text-red-400"
              : validation.remaining < 50
<<<<<<< HEAD
              ? "bg-orange-100/90 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400"
              : "bg-gray-100/90 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
=======
                ? "bg-orange-100/90 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400"
                : "bg-gray-100/90 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
          }`}
        >
          {validation.current} / {validation.limit}
        </div>
      )}
    </div>
  );
};

/**
 * Page utilization indicator component
 */
export const PageUtilizationIndicator = ({metrics, twoPageMode}) => {
  if (!metrics || twoPageMode) return null;

  const {utilizationPercent, estimatedLines} = metrics;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          📄 Page Usage
        </span>
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          ~{estimatedLines} / 45 lines
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            utilizationPercent > 100
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : utilizationPercent > 90
<<<<<<< HEAD
              ? "bg-gradient-to-r from-orange-500 to-orange-600"
              : utilizationPercent > 75
              ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
              : "bg-gradient-to-r from-green-500 to-green-600"
=======
                ? "bg-gradient-to-r from-orange-500 to-orange-600"
                : utilizationPercent > 75
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                  : "bg-gradient-to-r from-green-500 to-green-600"
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
          }`}
          style={{width: `${Math.min(utilizationPercent, 100)}%`}}
        />
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {utilizationPercent}% filled
        </span>
        {utilizationPercent > 90 && (
          <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
            ⚠️ Nearly full
          </span>
        )}
      </div>
    </div>
  );
};
