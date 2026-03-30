const normalizeText = (value) => String(value || "").trim();

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
  price: { prefix: "$", step: 50 },
  year: { step: 1 },
  years: { step: 1 },
  weight: { step: 1 },
  height: { step: 1 },
  width: { step: 1 },
  thickness: { step: 1 },
};

export const getRangeFieldConfig = (attribute) => {
  const fieldKey = normalizeText(attribute?.fieldKey).toLowerCase();
  return RANGE_FIELD_CONFIGS[fieldKey] || { prefix: "", step: 1 };
};

export const getResolvedFieldType = (attribute) => {
  if (Array.isArray(attribute?.values) && attribute.values.length > 0) {
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

const matchesSingleAttributeValue = (productText, selectedValue) =>
  productText.includes(normalizeSearchText(selectedValue));

const matchesAttributeValue = (product, attribute, selectedValue) => {
  const fieldType = getResolvedFieldType(attribute);

  if (fieldType === "multi_select") {
    if (!Array.isArray(selectedValue) || selectedValue.length === 0) {
      return true;
    }

    const productText = buildSearchableProductText(product);
    return selectedValue.some((value) =>
      matchesSingleAttributeValue(productText, value),
    );
  }

  if (fieldType === "range") {
    const minValue = parseNumberInput(selectedValue?.min);
    const maxValue = parseNumberInput(selectedValue?.max);

    if (minValue === null && maxValue === null) {
      return true;
    }

    const numbers = buildProductNumbers(product);

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
) =>
  attributes.filter((attribute) => {
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

export const buildAdvancedSearchRequestPayload = (attributes, filters) => {
  const categories = new Map();

  attributes.forEach((attribute) => {
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

    if (brandCategoryIds.length === 0) {
      return;
    }

    brandCategoryIds.forEach((categoryId) => {
      if (!categories.has(categoryId)) {
        categories.set(categoryId, {
          id: categoryId,
          filters: {},
        });
      }

      categories.get(categoryId).filters[attribute.attributeId] = filterValue;
    });
  });

  return Array.from(categories.values()).filter(
    (category) => Object.keys(category.filters).length > 0,
  );
};
