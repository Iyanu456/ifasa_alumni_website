export const formatDate = (value?: string | null, options?: Intl.DateTimeFormatOptions) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(date);
};

export const formatCurrency = (value: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatRelativeTime = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const diffMs = date.getTime() - Date.now();

  if (Number.isNaN(diffMs)) {
    return value;
  }

  const minutes = Math.round(diffMs / (1000 * 60));
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(minutes) < 60) {
    return formatter.format(minutes, "minute");
  }

  const hours = Math.round(minutes / 60);

  if (Math.abs(hours) < 24) {
    return formatter.format(hours, "hour");
  }

  const days = Math.round(hours / 24);
  return formatter.format(days, "day");
};

export const buildAvatarFallback = (seed: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}`;


export const truncateText = (
  text: string,
  maxLength: number,
  suffix = "..."
): string => {
  if (!text) return "";

  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return (lastSpace > 0
    ? truncated.slice(0, lastSpace)
    : truncated) + suffix;
};