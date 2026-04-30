export const parseDate = value => {
  if (value == null) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value, options = {}) => {
  const date = parseDate(value);
  if (!date) return "N/A";

  // If no options provided, fallback to the old default format
  if (Object.keys(options).length === 0) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }

  const { locale = "en-US", dateStyle = "medium", timeStyle } = options;

  const formatOptions = {
    dateStyle,
    ...(timeStyle ? { timeStyle } : {}),
  };

  return new Intl.DateTimeFormat(locale, formatOptions).format(date);
};

export const formatTime = (value) => {
  const date = parseDate(value);
  if (!date) return "N/A";
  
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const formatDateTime = (value, options = {}) =>
  formatDate(value, { ...options, dateStyle: "medium", timeStyle: "short" });

export default formatDate;
