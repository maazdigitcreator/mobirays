import { useEffect, useMemo, useState } from "react";
import { advancedSearchService } from "../services/advancedSearchService";

const normalizeText = (value) => String(value || "").trim();

const normalizeKey = (value) =>
  normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const normalizeValues = (values) =>
  Array.from(
    new Set(
      (Array.isArray(values) ? values : [])
        .map((value) => normalizeText(value))
        .filter(Boolean),
    ),
  );

const normalizeCategoryId = (value) => {
  const normalizedValue = normalizeText(
    value?.brand_category_id ?? value?.category_id ?? value?.id ?? value,
  );

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : normalizedValue;
};

const normalizeCategoryIds = (...sources) =>
  Array.from(
    new Set(
      sources
        .flatMap((source) => (Array.isArray(source) ? source : [source]))
        .flatMap((source) =>
          Array.isArray(source?.categories)
            ? source.categories
            : Array.isArray(source?.brand_categories)
              ? source.brand_categories
              : source,
        )
        .map((value) => normalizeCategoryId(value))
        .filter(Boolean),
    ),
  );

const parseOptionalNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const normalizeInputType = (value) => {
  const normalizedValue = normalizeKey(value);

  if (
    normalizedValue === "select" ||
    normalizedValue === "dropdown" ||
    normalizedValue === "multi_select"
  ) {
    return "multi_select";
  }

  if (
    normalizedValue === "range" ||
    normalizedValue === "slider" ||
    normalizedValue === "min_max"
  ) {
    return "range";
  }

  if (
    normalizedValue === "checkbox" ||
    normalizedValue === "boolean" ||
    normalizedValue === "toggle"
  ) {
    return "checkbox";
  }

  if (normalizedValue === "text" || normalizedValue === "input") {
    return "text";
  }

  return "";
};

const normalizeAttributes = (attributes, sectionTitle, sectionCategoryIds) =>
  (Array.isArray(attributes) ? attributes : [])
    .map((attribute) => {
      const name = normalizeText(attribute?.name);
      const attributeId = normalizeText(attribute?.attribute_id ?? name);
      const fieldKey = normalizeKey(attributeId || name);
      const rangeConfig = attribute?.range || {};
      const brandCategoryIds = normalizeCategoryIds(
        attribute?.brand_category_id,
        attribute?.brand_category_ids,
        attribute?.categories,
        attribute?.brand_categories,
        sectionCategoryIds,
      );
      const inputType = normalizeInputType(
        attribute?.input_type ||
          attribute?.inputType ||
          attribute?.control_type ||
          attribute?.filter_type ||
          attribute?.type,
      );

      if (!name || !fieldKey) {
        return null;
      }

      return {
        attributeId,
        fieldKey,
        name,
        sectionTitle,
        values: normalizeValues(attribute?.values),
        inputType,
        min: parseOptionalNumber(attribute?.min ?? rangeConfig?.min),
        max: parseOptionalNumber(attribute?.max ?? rangeConfig?.max),
        step: parseOptionalNumber(attribute?.step ?? rangeConfig?.step),
        unit: normalizeText(attribute?.unit ?? rangeConfig?.unit),
        prefix: normalizeText(attribute?.prefix ?? rangeConfig?.prefix),
        placeholder: normalizeText(attribute?.placeholder),
        brandCategoryIds,
      };
    })
    .filter(Boolean);

const getPayloadSections = (response) =>
  Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];

const normalizeSections = (payload) =>
  (Array.isArray(payload) ? payload : [])
    .map((section) => {
      const title = normalizeText(section?.title);
      const brandCategoryIds = normalizeCategoryIds(
        section?.brand_category_id,
        section?.brand_category_ids,
        section?.categories,
        section?.brand_categories,
      );
      const attributes = normalizeAttributes(
        section?.attributes,
        title,
        brandCategoryIds,
      );

      if (!title || attributes.length === 0) {
        return null;
      }

      return {
        title,
        brandCategoryIds,
        attributes,
      };
    })
    .filter(Boolean);

export const useAdvancedSearchAttributes = () => {
  const [sections, setSections] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchAttributes = async () => {
      setStatus({
        loading: true,
        error: "",
      });

      try {
        const response = await advancedSearchService.getAllAttributes();
        const normalizedSections = normalizeSections(
          getPayloadSections(response),
        );

        if (!isMounted) {
          return;
        }

        setSections(normalizedSections);
        setStatus({
          loading: false,
          error: "",
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setSections([]);
        setStatus({
          loading: false,
          error:
            error?.data?.message ||
            error?.message ||
            "Failed to load advanced search attributes.",
        });
      }
    };

    fetchAttributes();

    return () => {
      isMounted = false;
    };
  }, []);

  const attributes = useMemo(
    () => sections.flatMap((section) => section.attributes),
    [sections],
  );

  return {
    sections,
    attributes,
    status,
  };
};
