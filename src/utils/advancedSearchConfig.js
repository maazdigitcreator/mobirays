const normalizeText = (value) => String(value || "").trim();

const normalizeKey = (value) =>
  normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export const ADVANCED_SEARCH_TABS = [
  { id: 3, label: "Smartwatches" },
  { id: 2, label: "Tabs" },
  { id: 1, label: "Phones" },
];

const RANGE_FIELD_KEYS = new Set([
  "general_year",
  "general_years",
  "general_price",
  "body_height",
  "body_width",
  "body_thickness",
  "body_weight",
  "platform_cpu_cores",
  "memory_ram",
  "memory_storage",
  "display_resolution",
  "display_size",
  "display_density",
  "display_refresh_rate",
  "main_camera_resolution",
  "main_camera_f_number",
  "main_camera_video",
  "front_camera_resolution",
  "battery_capacity",
  "battery_wired_charging",
  "battery_wireless_charging",
]);

const TEXT_FIELD_KEYS = new Set(["body_color"]);

export const getAdvancedSearchConfiguredFieldType = (attribute) => {
  const scopedFieldKey = normalizeKey(
    `${attribute?.sectionTitle}_${attribute?.name}`,
  );
  const attributeName = normalizeKey(attribute?.name);
  const fieldKey = normalizeKey(attribute?.fieldKey);

  const lookupKeys = [scopedFieldKey, attributeName, fieldKey].filter(Boolean);

  if (lookupKeys.some((key) => RANGE_FIELD_KEYS.has(key))) {
    return "range";
  }

  if (lookupKeys.some((key) => TEXT_FIELD_KEYS.has(key))) {
    return "text";
  }

  return "";
};

export const getAdvancedSearchTabByCategoryId = (categoryId) =>
  ADVANCED_SEARCH_TABS.find((tab) => tab.id === Number(categoryId)) || null;

export const isAdvancedSearchAttributeInCategory = (attribute, categoryId) =>
  Array.isArray(attribute?.brandCategoryIds) &&
  attribute.brandCategoryIds.some((value) => Number(value) === Number(categoryId));
