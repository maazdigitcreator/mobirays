import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { filterService } from "../services/filterService";
import {
  buildSidebarFilters,
  decodeSidebarFilterQuery,
  encodeSidebarFilterQuery,
} from "../utils/sidebarFilters";

export const useSidebarFilters = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({});
  const [selectedFilters, setSelectedFilters] = useState(() => {
    return decodeSidebarFilterQuery(
      new URLSearchParams(location.search).get("filters"),
    ).reduce((acc, category) => {
      Object.entries(category.filters || {}).forEach(([filterId, values]) => {
        acc[`${filterId}-${category.id}`] = values;
      });
      return acc;
    }, {});
  });
  const [attributes, setAttributes] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchAttributes = async () => {
      setStatus({
        loading: true,
        error: "",
      });

      try {
        const response = await filterService.getAllAttributes({
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        setAttributes(response.data);
        setStatus({
          loading: false,
          error: "",
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setAttributes([]);
        setStatus({
          loading: false,
          error:
            error?.data?.message || error?.message || "Failed to load filters.",
        });
      }
    };

    fetchAttributes();

    return () => {
      controller.abort();
    };
  }, []);

  const filters = useMemo(() => buildSidebarFilters(attributes), [attributes]);

  const toggleSection = (sectionId) => {
    setOpenSections(sectionId ? { [sectionId]: true } : {});
  };

  const toggleFilter = (filterId, categoryId, option) => {
    const selectionId = `${filterId}-${categoryId}`;
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

    const params = new URLSearchParams(location.search);

    if (params.has("filters") || params.has("page")) {
      navigate("/", { replace: true });
    }
  };

  const handleApplyFilters = () => {
    const groupedFilters = filters.reduce((acc, filter) => {
      filter.groups.forEach((group) => {
        const selectionId = `${filter.id}-${group.categoryId}`;
        const values = selectedFilters[selectionId] || [];

        if (values.length === 0) {
          return;
        }

        const existingCategory = acc.find(
          (item) => item.id === group.categoryId,
        );

        if (existingCategory) {
          existingCategory.filters[filter.id] = values;
          return;
        }

        acc.push({
          id: group.categoryId,
          filters: {
            [filter.id]: values,
          },
        });
      });

      return acc;
    }, []);

    const params = new URLSearchParams();

    if (groupedFilters.length > 0) {
      params.set("filters", encodeSidebarFilterQuery(groupedFilters));
      params.set("page", "1");
    }

    navigate(params.toString() ? `/?${params.toString()}` : "/", {
      replace: location.pathname === "/",
    });
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
