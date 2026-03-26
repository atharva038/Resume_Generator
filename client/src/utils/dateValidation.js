export const formatDateInput = (value, currentValue = "") => {
  let cleaned = value.replace(/[^\d/]/g, "");
  if (cleaned.length > currentValue.length) {
    if (cleaned.length === 2 && !cleaned.includes("/")) {
      cleaned = cleaned + "/";
    } else if (cleaned.length === 5 && cleaned.split("/").length === 2) {
      cleaned = cleaned + "/";
    }
  }

  if (cleaned.length > 10) {
    cleaned = cleaned.substring(0, 10);
  }

  return cleaned;
};

export const isValidDate = (dateStr) => {
  if (!dateStr) return true;

  const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = dateStr.match(dateRegex);

  if (!match) return false;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

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
};

export const getDateValidationMessage = (dateStr) => {
  if (!dateStr) return "";

  const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = dateStr.match(dateRegex);

  if (!match) {
    if (dateStr.length < 10) {
      return "Date must be in DD/MM/YYYY format";
    }
    return "Invalid date format. Use DD/MM/YYYY";
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12) {
    return "Month must be between 01 and 12";
  }

  if (day < 1 || day > 31) {
    return "Day must be between 01 and 31";
  }

  if (year < 1900 || year > 2100) {
    return "Year must be between 1900 and 2100";
  }

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  
  if (month === 2) {
    if (day > (isLeapYear ? 29 : 28)) {
      return `February ${year} has only ${isLeapYear ? 29 : 28} days`;
    }
  } else {
    if (day > daysInMonth[month - 1]) {
      return `Invalid day for month ${month}`;
    }
  }

  return "";
};

export const handleDateChange = (newValue, currentValue, updateCallback) => {
  const formattedValue = formatDateInput(newValue, currentValue);
  if (formattedValue !== null) {
    updateCallback(formattedValue);
  }
};
