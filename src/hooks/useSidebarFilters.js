import { useEffect, useMemo, useState } from "react";
import { filterService } from "../services/filterService";
import { buildSidebarFilters } from "../utils/sidebarFilters";

export const useSidebarFilters = () => {
  const [openSections, setOpenSections] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
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
        const response = await filterService.getAllAttributes();
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
          error: error?.data?.message || error?.message || "Failed to load filters.",
        });
      }
    };

    fetchAttributes();

    return () => {
      isMounted = false;
    };
  }, []);

  const filters = useMemo(() => buildSidebarFilters(attributes), [attributes]);

  const toggleSection = (sectionId) => {
    setOpenSections(sectionId ? { [sectionId]: true } : {});
  };

  const toggleFilter = (categoryId, groupTitle, option) => {
    const selectionId = `${categoryId}-${groupTitle}`;
    setSelectedFilters((prev) => {
      const categoryFilters = prev[selectionId] || [];
      if (categoryFilters.includes(option)) {
        return {
          ...prev,
          [selectionId]: categoryFilters.filter((item) => item !== option),
        };
      }

      return {
        ...prev,
        [selectionId]: [...categoryFilters, option],
      };
    });
  };

  const resetFilters = () => {
    setSelectedFilters({});
  };

  const handleApplyFilters = () => {
  };

  const totalSelected = useMemo(
    () => Object.values(selectedFilters).flat().length,
    [selectedFilters],
  );

  return {
    filters,
    openSections,
    selectedFilters,
    status,
    totalSelected,
    toggleSection,
    toggleFilter,
    resetFilters,
    handleApplyFilters,
  };
};
