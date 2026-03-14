const ATTRIBUTE_LABELS = {
  network: "Search by Network",
  ram: "Search by RAM",
  screen: "Search by Screen",
  camera: "Search by Camera",
  storage: "Search by Storage",
  os: "Search by OS",
  price: "Search by Price",
};

const ATTRIBUTE_ORDER = [
  "network",
  "ram",
  "screen",
  "camera",
  "storage",
  "os",
  "price",
];

const CATEGORY_LABELS = {
  phone: "Phones",
  phones: "Phones",
  tabs: "Tabs",
  tab: "Tabs",
  smartwatch: "Watches",
  smartwatches: "Watches",
  watch: "Watches",
  watches: "Watches",
};

export const normalizeAttributeId = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const normalizeCategoryTitle = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  return CATEGORY_LABELS[normalized] || value || "Other";
};

export const buildSidebarFilters = (attributes) => {
  const mappedFilters = attributes
    .map((attribute) => {
      const id = normalizeAttributeId(attribute?.attribute_name);
      const groups = Array.isArray(attribute?.categories)
        ? attribute.categories
            .map((category) => ({
              title: normalizeCategoryTitle(category?.brand_category_name),
              options: Array.from(new Set(category?.values || [])),
            }))
            .filter((group) => group.options.length > 0)
        : [];

      if (!id || groups.length === 0) {
        return null;
      }

      return {
        id,
        label: ATTRIBUTE_LABELS[id] || `Search by ${attribute.attribute_name}`,
        groups,
      };
    })
    .filter(Boolean);

  return mappedFilters.sort((left, right) => {
    const leftIndex = ATTRIBUTE_ORDER.indexOf(left.id);
    const rightIndex = ATTRIBUTE_ORDER.indexOf(right.id);
    const safeLeftIndex = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
    const safeRightIndex = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;
    return safeLeftIndex - safeRightIndex;
  });
};
