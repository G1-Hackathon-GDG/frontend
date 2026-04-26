export const parseDate = value => {
  if (value == null) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value, options = {}) => {
  const date = parseDate(value);
  if (!date) return "";

  const { locale = "en-US", dateStyle = "medium", timeStyle } = options;

  const formatOptions = {
    dateStyle,
    ...(timeStyle ? { timeStyle } : {}),
  };

  return new Intl.DateTimeFormat(locale, formatOptions).format(date);
};

export const formatDateTime = (value, options = {}) =>
  formatDate(value, { ...options, dateStyle: "medium", timeStyle: "short" });
