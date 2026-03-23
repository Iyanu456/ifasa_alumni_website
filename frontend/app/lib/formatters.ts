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

const createSvgDataUri = (svg: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const getInitials = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "IA";

const escapeSvgText = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const buildAvatarFallback = (seed: string) => {
  const initials = escapeSvgText(getInitials(seed));

  return createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" role="img" aria-label="${initials}">
      <rect width="320" height="320" fill="#efe7d8" />
      <circle cx="160" cy="160" r="124" fill="#d7c3a4" />
      <text x="160" y="182" text-anchor="middle" font-family="Arial, sans-serif" font-size="108" font-weight="700" fill="#5f4729">${initials}</text>
    </svg>
  `);
};

export const buildContentFallbackImage = (
  kind: "news" | "event" | "opportunity" | "post" | "scholarship",
  seed: string,
) => {
  const title = escapeSvgText(seed.trim() || "IFASA Alumni");
  const label = escapeSvgText(kind.toUpperCase());

  return createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-label="${title}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f4eee1" />
          <stop offset="100%" stop-color="#dfcfb1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)" />
      <rect x="72" y="72" width="1056" height="656" rx="32" fill="#ffffff" fill-opacity="0.42" />
      <text x="100" y="168" font-family="Arial, sans-serif" font-size="42" font-weight="700" letter-spacing="6" fill="#8a6a3e">${label}</text>
      <text x="100" y="304" font-family="Arial, sans-serif" font-size="78" font-weight="700" fill="#342311">${title}</text>
      <text x="100" y="386" font-family="Arial, sans-serif" font-size="30" fill="#6b5537">Ife Architecture Alumni Association</text>
    </svg>
  `);
};


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
