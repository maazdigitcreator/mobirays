import { useEffect, useMemo, useState } from "react";
import { advancedSearchService } from "../services/advancedSearchService";

const ATTRIBUTE_NAMES = {
  brand: "Brand",
  network: "Network",
  availability: "Availability",
  size: "Size",
};

const getAttributeValues = (attributes, attributeName) => {
  const attribute = attributes.find((item) => item.name === attributeName);

  if (!attribute || !Array.isArray(attribute.values)) {
    return [];
  }

  return Array.from(
    new Set(
      attribute.values
        .map((value) => String(value || "").trim())
        .filter(Boolean),
    ),
  );
};

export const useAdvancedSearchAttributes = () => {
  const [attributes, setAttributes] = useState([]);
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
        const data = Array.isArray(response?.data) ? response.data : [];

        if (!isMounted) return;

        setAttributes(data);
        setStatus({
          loading: false,
          error: "",
        });
      } catch (error) {
        if (!isMounted) return;

        setAttributes([]);
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

  const options = useMemo(
    () => ({
      brandOptions: getAttributeValues(attributes, ATTRIBUTE_NAMES.brand),
      networkOptions: getAttributeValues(attributes, ATTRIBUTE_NAMES.network),
      availabilityOptions: getAttributeValues(
        attributes,
        ATTRIBUTE_NAMES.availability,
      ),
      simSizeOptions: getAttributeValues(attributes, ATTRIBUTE_NAMES.size),
    }),
    [attributes],
  );

  return {
    ...options,
    status,
  };
};
