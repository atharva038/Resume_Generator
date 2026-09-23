/**
 * Date validation and formatting utilities for Resume Editor
 * Supports MM/YYYY, Mon YYYY (e.g. Aug 2023), YYYY, DD/MM/YYYY, and Present/Ongoing formats.
 */

const MONTH_NAMES = [
  "jan", "january", "feb", "february", "mar", "march",
  "apr", "april", "may", "jun", "june",
  "jul", "july", "aug", "august", "sep", "sept", "september",
  "oct", "october", "nov", "november", "dec", "december"
];

/**
 * Validates whether a date string is in an acceptable ATS resume date format.
 * Accepted formats:
 * - Mon YYYY / Month YYYY (e.g., "Aug 2023", "August 2023", "May 2027", "Aug '23")
 * - MM/YYYY or M/YYYY (e.g., "08/2023", "8/2023", "05/2027")
 * - MM/YY or M/YY (e.g., "08/23", "5/27")
 * - YYYY (e.g., "2023", "2027")
 * - DD/MM/YYYY (e.g., "15/08/2023")
 * - "Present", "Current", "Ongoing", "Expected May 2027"
 */
export const isValidDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return true;
  const trimmed = dateStr.trim();
  if (!trimmed) return true;

  // 1. Present / Current / Ongoing / Expected formats
  if (
    /^(present|current|ongoing|now|in progress|expected(\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|[0-9]{1,2}\/)?[a-z]*\s*\d{2,4})?)$/i.test(
      trimmed
    )
  ) {
    return true;
  }

  // 2. Year only (e.g., 2023, 2027)
  if (/^(19|20)\d{2}$/.test(trimmed)) {
    return true;
  }

  // 3. Month Name + Year (e.g., "Aug 2023", "August 2023", "May 2027", "Aug '23", "Aug. 2023")
  const monthNameMatch = trimmed.match(
    /^([A-Za-z]+)\.?\s*['’]?\s*(\d{2,4})$/
  );
  if (monthNameMatch) {
    const month = monthNameMatch[1].toLowerCase();
    const year = parseInt(monthNameMatch[2], 10);
    if (MONTH_NAMES.includes(month)) {
      if (year >= 0 && year <= 99) return true;
      if (year >= 1900 && year <= 2100) return true;
    }
  }

  // 4. MM/YYYY or MM-YYYY (e.g., 08/2023, 8/2023, 05-2027)
  const mmYyyyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{4})$/);
  if (mmYyyyMatch) {
    const month = parseInt(mmYyyyMatch[1], 10);
    const year = parseInt(mmYyyyMatch[2], 10);
    if (month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
      return true;
    }
    return false;
  }

  // 5. MM/YY (e.g., 08/23, 5/27)
  const mmYyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{2})$/);
  if (mmYyMatch) {
    const month = parseInt(mmYyMatch[1], 10);
    if (month >= 1 && month <= 12) {
      return true;
    }
    return false;
  }

  // 6. DD/MM/YYYY (e.g., 15/08/2023)
  const ddMmYyyyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (ddMmYyyyMatch) {
    const day = parseInt(ddMmYyyyMatch[1], 10);
    const month = parseInt(ddMmYyyyMatch[2], 10);
    const year = parseInt(ddMmYyyyMatch[3], 10);

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2) {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      if (day > (isLeapYear ? 29 : 28)) return false;
    } else {
      if (day > daysInMonth[month - 1]) return false;
    }
    return true;
  }

  return false;
};

/**
 * Returns human-friendly validation message if date is invalid.
 */
export const getDateValidationMessage = (dateStr) => {
  if (!dateStr || !dateStr.trim()) return "";
  if (isValidDate(dateStr)) return "";

  const trimmed = dateStr.trim();

  // If user entered only digits that look like invalid numbers
  if (/^\d+$/.test(trimmed)) {
    if (trimmed.length !== 4) {
      return "Use MM/YYYY (e.g. 08/2023) or Year (e.g. 2023)";
    }
  }

  return "Format as MM/YYYY (e.g. 08/2023) or Mon YYYY (e.g. Aug 2023)";
};

/**
 * Formats date input on change while allowing flexible text like "Aug 2023", "Present", "08/2023".
 */
export const formatDateInput = (value) => {
  if (!value) return "";
  return value;
};

export const handleDateChange = (newValue, currentValue, updateCallback) => {
  updateCallback(newValue);
};
