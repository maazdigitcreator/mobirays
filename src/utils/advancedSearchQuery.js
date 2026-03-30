export const encodeAdvancedSearchQuery = (filters) =>
  btoa(JSON.stringify(filters))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

export const decodeAdvancedSearchQuery = (value) => {
  if (!value) {
    return {};
  }

  try {
    const normalizedValue = value.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (normalizedValue.length % 4)) % 4);
    const parsedValue = JSON.parse(atob(`${normalizedValue}${padding}`));
    return parsedValue && typeof parsedValue === "object" ? parsedValue : {};
  } catch {
    return {};
  }
};
