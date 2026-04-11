import {
  getAdvancedSearchConfiguredFieldType,
  isAdvancedSearchAttributeInCategory,
} from "./advancedSearchConfig";

const normalizeText = (value) => String(value || "").trim();

const normalizeKey = (value) =>
  normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const normalizeCategoryId = (value) => {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : normalizedValue;
};

const normalizeSearchText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export const RANGE_FIELD_CONFIGS = {
  general_price: { prefix: "$", step: 50 },
  general_year: { step: 1 },
  general_years: { step: 1 },
  body_weight: { step: 1 },
  body_height: { step: 1 },
  body_width: { step: 1 },
  body_thickness: { step: 1 },
};

export const getRangeFieldConfig = (attribute) => {
  const lookupKeys = [
    normalizeKey(`${attribute?.sectionTitle}_${attribute?.name}`),
    normalizeKey(attribute?.name),
    normalizeKey(attribute?.fieldKey),
  ].filter(Boolean);

  const matchedKey = lookupKeys.find((key) => RANGE_FIELD_CONFIGS[key]);
  return matchedKey ? RANGE_FIELD_CONFIGS[matchedKey] : { prefix: "", step: 1 };
};

export const getResolvedFieldType = (attribute) => {
  const configuredFieldType =
    getAdvancedSearchConfiguredFieldType(attribute) || attribute?.inputType;

  if (configuredFieldType) {
    return configuredFieldType;
  }

  // Detect boolean fields (Checkbox)
  if (Array.isArray(attribute?.options) && attribute.options.length === 2) {
    const labels = attribute.options.map((opt) =>
      String(opt.label).toLowerCase(),
    );
    if (labels.includes("true") && labels.includes("false")) {
      return "checkbox";
    }
  }

  if (Array.isArray(attribute?.options) && attribute.options.length > 0) {
    return "multi_select";
  }

  if (attribute?.min !== null || attribute?.max !== null) {
    return "range";
  }

  return "text";
};

export const buildInitialFilterValue = (attribute) => {
  const fieldType = getResolvedFieldType(attribute);

  if (fieldType === "multi_select") {
    return [];
  }

  if (fieldType === "range") {
    return { min: "", max: "" };
  }

  if (fieldType === "checkbox") {
    return "";
  }

  return "";
};

export const isFilterActive = (attribute, filterValue) => {
  const fieldType = getResolvedFieldType(attribute);

  if (fieldType === "multi_select") {
    return Array.isArray(filterValue) && filterValue.length > 0;
  }

  if (fieldType === "range") {
    return Boolean(filterValue?.min || filterValue?.max);
  }

  if (fieldType === "checkbox") {
    return filterValue === "True";
  }

  return Boolean(normalizeText(filterValue));
};

const parseNumberInput = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const flattenProductValues = (value, accumulator = []) => {
  if (value === null || value === undefined) {
    return accumulator;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => flattenProductValues(item, accumulator));
    return accumulator;
  }

  if (typeof value === "object") {
    Object.values(value).forEach((item) => flattenProductValues(item, accumulator));
    return accumulator;
  }

  accumulator.push(String(value));
  return accumulator;
};

const buildSearchableProductText = (product) =>
  normalizeSearchText(flattenProductValues(product).join(" "));

const buildProductNumbers = (product) =>
  flattenProductValues(product)
    .flatMap((value) => String(value).match(/-?\d+(\.\d+)?/g) || [])
    .map(Number)
    .filter((value) => Number.isFinite(value));

const parseProductDimensions = (product) => {
  const dimensionsStr =
    product?.specifications?.body ||
    product?.specifications?.dimensions ||
    product?.dimensions ||
    product?.body ||
    "";

  if (!dimensionsStr) {
    return { body_height: null, body_width: null, body_thickness: null };
  }

  // Common patterns: "146.7 x 71.5 x 7.8 mm", "160.8 x 78.1 x 7.7 mm (6.33 x 3.07 x 0.30 in)"
  const numbers = dimensionsStr.match(/\d+(\.\d+)?/g);

  if (!numbers || numbers.length < 3) {
    return { body_height: null, body_width: null, body_thickness: null };
  }

  return {
    body_height: Number(numbers[0]),
    body_width: Number(numbers[1]),
    body_thickness: Number(numbers[2]),
  };
};

const getAttributeValueFromProduct = (product, attribute) => {
  const payloadKey = attribute.payloadKey || attribute.attributeId;
  const attributeName = normalizeSearchText(attribute.name);

  // 1. Check top-level or specifications object
  const directValue =
    product[payloadKey] ??
    product.specifications?.[payloadKey] ??
    product.specifications?.[attribute.fieldKey];

  if (directValue !== undefined && directValue !== null) {
    return directValue;
  }

  // 2. Check more_specifications array
  if (Array.isArray(product.more_specifications)) {
    const matchedSpec = product.more_specifications.find(
      (spec) =>
        normalizeSearchText(spec.attribute) === attributeName ||
        normalizeSearchText(spec.value) === attributeName,
    );
    if (matchedSpec) {
      return matchedSpec.description || matchedSpec.value;
    }
  }

  return null;
};

const matchesSingleAttributeValue = (targetText, selectedValue) => {
  const normalizedTarget = normalizeSearchText(targetText);
  const normalizedSelected = normalizeSearchText(selectedValue);
  return normalizedTarget.includes(normalizedSelected);
};

const matchesAttributeValue = (product, attribute, selectedValue) => {
  const fieldType = getResolvedFieldType(attribute);

  if (fieldType === "multi_select") {
    if (!Array.isArray(selectedValue) || selectedValue.length === 0) {
      return true;
    }

    const value = getAttributeValueFromProduct(product, attribute);
    if (value === null) {
      // Fallback to broad search only if targeted search fails
      const productText = buildSearchableProductText(product);
      return selectedValue.some((v) =>
        matchesSingleAttributeValue(productText, v),
      );
    }

    const valueText = String(value);
    return selectedValue.some((v) => matchesSingleAttributeValue(valueText, v));
  }

  if (fieldType === "checkbox") {
    if (selectedValue !== "True") {
      return true;
    }

    const value = getAttributeValueFromProduct(product, attribute);
    if (value === null) {
      return false; // If we can't find the field, it's not "True"
    }

    const normalizedValue = normalizeSearchText(value);
    return (
      normalizedValue === "true" ||
      normalizedValue === "yes" ||
      normalizedValue === "1"
    );
  }

  if (fieldType === "range") {
    const minValue = parseNumberInput(selectedValue?.min);
    const maxValue = parseNumberInput(selectedValue?.max);

    if (minValue === null && maxValue === null) {
      return true;
    }

    const numbers = buildProductNumbers(product);

    if (
      attribute.fieldKey === "body_height" ||
      attribute.fieldKey === "body_width" ||
      attribute.fieldKey === "body_thickness"
    ) {
      const dimensions = parseProductDimensions(product);
      const value = dimensions[attribute.fieldKey];

      if (value === null) {
        return true;
      }

      if (minValue !== null && value < minValue) {
        return false;
      }

      if (maxValue !== null && value > maxValue) {
        return false;
      }

      return true;
    }

    if (numbers.length === 0) {
      return true;
    }

    return numbers.some((value) => {
      if (minValue !== null && value < minValue) {
        return false;
      }

      if (maxValue !== null && value > maxValue) {
        return false;
      }

      return true;
    });
  }

  const textValue = normalizeText(selectedValue);

  if (!textValue) {
    return true;
  }

  return buildSearchableProductText(product).includes(
    normalizeSearchText(textValue),
  );
};

export const runAdvancedSearch = (allProducts, attributes, filters) => {
  const activeAttributes = attributes.filter((attribute) =>
    isFilterActive(
      attribute,
      filters[attribute.fieldKey] ?? buildInitialFilterValue(attribute),
    ),
  );

  if (activeAttributes.length === 0) {
    return allProducts;
  }

  return allProducts.filter((product) =>
    activeAttributes.every((attribute) =>
      matchesAttributeValue(
        product,
        attribute,
        filters[attribute.fieldKey] ?? buildInitialFilterValue(attribute),
      ),
    ),
  );
};

export const getAdvancedSearchAttributesMissingCategoryIds = (
  attributes,
  filters,
  { activeCategoryId = null } = {},
) =>
  attributes.filter((attribute) => {
    if (
      activeCategoryId !== null &&
      !isAdvancedSearchAttributeInCategory(attribute, activeCategoryId)
    ) {
      return false;
    }

    const filterValue =
      filters[attribute.fieldKey] ?? buildInitialFilterValue(attribute);

    if (!isFilterActive(attribute, filterValue)) {
      return false;
    }

    const brandCategoryIds = Array.isArray(attribute.brandCategoryIds)
      ? attribute.brandCategoryIds
        .map((value) => normalizeCategoryId(value))
        .filter(Boolean)
      : [];

    return brandCategoryIds.length === 0;
  });

export const buildAdvancedSearchRequestPayload = (
  attributes,
  filters,
  { activeCategoryId = null, includeEmptyActiveCategory = false } = {},
) => {
  const categories = new Map();

  attributes.forEach((attribute) => {
    if (
      activeCategoryId !== null &&
      !isAdvancedSearchAttributeInCategory(attribute, activeCategoryId)
    ) {
      return;
    }

    const filterValue =
      filters[attribute.fieldKey] ?? buildInitialFilterValue(attribute);

    if (!isFilterActive(attribute, filterValue)) {
      return;
    }

    const brandCategoryIds = Array.isArray(attribute.brandCategoryIds)
      ? attribute.brandCategoryIds
        .map((value) => normalizeCategoryId(value))
        .filter(Boolean)
      : [];
    const resolvedCategoryIds =
      activeCategoryId === null
        ? brandCategoryIds
        : brandCategoryIds.filter(
          (categoryId) => Number(categoryId) === Number(activeCategoryId),
        );

    if (resolvedCategoryIds.length === 0) {
      return;
    }

    resolvedCategoryIds.forEach((categoryId) => {
      if (!categories.has(categoryId)) {
        categories.set(categoryId, {
          id: categoryId,
          filters: {},
        });
      }

      const categoryData = categories.get(categoryId);

      const payloadKey = attribute.payloadKey || attribute.attributeId;
      categoryData.filters[payloadKey] = filterValue;
    });
  });

  const resolvedCategories = Array.from(categories.values()).filter(
    (category) => Object.keys(category.filters).length > 0,
  );

  if (
    resolvedCategories.length === 0 &&
    includeEmptyActiveCategory &&
    activeCategoryId !== null
  ) {
    return [
      {
        id: activeCategoryId,
        filters: {},
      },
    ];
  }

  return resolvedCategories;
};
