import { useEffect, useMemo, useState } from "react";
import { advancedSearchService } from "../services/advancedSearchService";
import { getAdvancedSearchConfiguredFieldType } from "../utils/advancedSearchConfig";

const normalizeText = (value) => String(value || "").trim();

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

const normalizeOptionValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : normalizedValue;
};

const normalizeOptions = (values) => {
  const seenValues = new Set();

  return (Array.isArray(values) ? values : []).reduce((accumulator, value) => {
    const option =
      value && typeof value === "object" && !Array.isArray(value)
        ? {
            label: normalizeText(
              value.name ?? value.label ?? value.value ?? value.id,
            ),
            value: normalizeOptionValue(
              value.id ?? value.value ?? value.slug ?? value.name,
            ),
          }
        : {
            label: normalizeText(value),
            value: normalizeOptionValue(value),
          };

    if (!option.label || option.value === null) {
      return accumulator;
    }

    const dedupeKey = `${typeof option.value}:${String(option.value)}`;

    if (seenValues.has(dedupeKey)) {
      return accumulator;
    }

    seenValues.add(dedupeKey);
    accumulator.push(option);
    return accumulator;
  }, []);
};

const resolveRangeBounds = (attribute, options, inputType) => {
  const rangeConfig = attribute?.range || {};
  const explicitMin = parseOptionalNumber(attribute?.min ?? rangeConfig?.min);
  const explicitMax = parseOptionalNumber(attribute?.max ?? rangeConfig?.max);

  if (explicitMin !== null || explicitMax !== null) {
    return {
      min: explicitMin,
      max: explicitMax,
    };
  }

  if (inputType !== "range") {
    return {
      min: null,
      max: null,
    };
  }

  const numericOptions = options
    .map((option) => parseOptionalNumber(option.value))
    .filter((value) => value !== null);

  if (numericOptions.length === 0) {
    return {
      min: null,
      max: null,
    };
  }

  return {
    min: Math.min(...numericOptions),
    max: Math.max(...numericOptions),
  };
};

const normalizeAttributes = (attributes, sectionTitle, sectionCategoryIds) =>
  (Array.isArray(attributes) ? attributes : [])
    .map((attribute) => {
      const name = normalizeText(attribute?.name);
      const attributeId = normalizeText(attribute?.attribute_id ?? name);
      const fieldKey = attributeId || normalizeText(`${sectionTitle}_${name}`);
      const brandCategoryIds = normalizeCategoryIds(
        attribute?.brand_category_id,
        attribute?.brand_category_ids,
        attribute?.categories,
        attribute?.brand_categories,
        sectionCategoryIds,
      );
      const options = normalizeOptions(attribute?.values);
      const inputType = getAdvancedSearchConfiguredFieldType({
        fieldKey,
        sectionTitle,
        name,
      });
      const rangeBounds = resolveRangeBounds(attribute, options, inputType);

      if (!name || !fieldKey) {
        return null;
      }

      let normalizedPayloadKey = name?.trim().toLowerCase() || name;

      if (normalizedPayloadKey === "ois") {
        const normalizedSection = sectionTitle?.trim().toLowerCase();
        if (normalizedSection === "main camera") {
          normalizedPayloadKey = "main_camera_ois";
        } else if (normalizedSection === "selfie camera") {
          normalizedPayloadKey = "selfie_camera_ois";
        }
      }

      return {
        attributeId,
        fieldKey,
        payloadKey: normalizedPayloadKey,
        name,
        sectionTitle,
        values: options.map((option) => option.label),
        options,
        inputType,
        min: rangeBounds.min,
        max: rangeBounds.max,
        step: parseOptionalNumber(attribute?.step ?? attribute?.range?.step),
        unit: normalizeText(attribute?.unit ?? attribute?.range?.unit),
        prefix: normalizeText(attribute?.prefix ?? attribute?.range?.prefix),
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

let cachedSections = null;

export const useAdvancedSearchAttributes = () => {
  const [sections, setSections] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });

  useEffect(() => {
    let isMounted = true;

    if (cachedSections) {
      setSections(cachedSections);
      setStatus({ loading: false, error: "" });
      return;
    }

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

        cachedSections = normalizedSections;
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
