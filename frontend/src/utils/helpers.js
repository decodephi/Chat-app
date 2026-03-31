import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";

/**
 * Format a message timestamp for display in chat bubbles.
 * Shows: "HH:mm" for today, "Yesterday HH:mm", or "MMM d, HH:mm"
 */
export const formatMessageTime = (date) => {
  const d = new Date(date);
  if (isToday(d))     return format(d, "HH:mm");
  if (isYesterday(d)) return `Yesterday ${format(d, "HH:mm")}`;
  return format(d, "MMM d, HH:mm");
};

/**
 * Format last seen / recent activity
 */
export const formatRelativeTime = (date) =>
  formatDistanceToNow(new Date(date), { addSuffix: true });

/**
 * Get initials from a name (up to 2 chars)
 */
export const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/**
 * Truncate long strings for previews
 */
export const truncate = (str, max = 40) =>
  str?.length > max ? str.slice(0, max) + "…" : str;
