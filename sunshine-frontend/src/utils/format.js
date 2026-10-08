/** "14:30" -> "2:30 PM". Returns null for empty input. */
export const formatTime = (timeString) => {
  if (!timeString) return null;
  const [hourString, minute = "00"] = timeString.split(":");
  const hour = Number.parseInt(hourString, 10);
  if (Number.isNaN(hour)) return timeString;
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${minute} ${suffix}`;
};

/** Price before the advertised discount, rounded to whole rupees. */
export const originalPriceFor = (price, discountPercent) =>
  Math.round(Number(price) * (1 + discountPercent / 100));

export const formatPrice = (value) => `₹${Number(value).toLocaleString("en-IN")}`;
