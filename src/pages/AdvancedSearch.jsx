import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeroBanner from "../components/Layout/HeroBanner";
import LatestProducts from "../components/LatestProducts";
import SidebarBanner1 from "../components/SidebarSections/SidebarBanner1";
import SidebarBanner2 from "../components/SidebarSections/SidebarBanner2";
import SidebarBrands from "../components/SidebarSections/SidebarBrands";
import SidebarFilters from "../components/SidebarSections/SidebarFilters";
import SidebarIntro from "../components/SidebarSections/SidebarIntro";
import SidebarLatestModels from "../components/SidebarSections/SidebarLatestModels";
import SidebarStats from "../components/SidebarSections/SidebarStats";
import { useData } from "../context/useData";
import { useAdvancedSearchAttributes } from "../hooks/useAdvancedSearchAttributes";
import useMetadata from "../hooks/useMetadata";
import { advancedSearchService } from "../services/advancedSearchService";
import {
  ADVANCED_SEARCH_TABS,
  getAdvancedSearchTabByCategoryId,
  isAdvancedSearchAttributeInCategory,
} from "../utils/advancedSearchConfig";
import {
  buildAdvancedSearchRequestPayload,
  buildInitialFilterValue,
  getAdvancedSearchAttributesMissingCategoryIds,
  getRangeFieldConfig,
  getResolvedFieldType,
  isFilterActive,
  runAdvancedSearch,
} from "../utils/advancedSearchFilters";
import {
  decodeAdvancedSearchQuery,
  encodeAdvancedSearchQuery,
} from "../utils/advancedSearchQuery";
import { filterProductsByCategory } from "../utils/filterHelpers";

const OS_VERSION_MAP = {
  "Android": ["Any Version", "Android 16", "Android 15", "Android 14", "Android 13", "Android 12", "Android 11", "Android 10", "Android 9.0 Pie", "Android 8.1 Oreo", "Android 8.0 Oreo", "Android 7.1 Nougat", "Android 7.0 Nougat", "Android 6.0 Marshmallow", "Android 5.1 Lollipop", "Android 5.0 Lollipop", "Android 4.4 KitKat", "Android 4.1-4.3 Jelly Bean", "Android 4.0 Ice Cream Sandwich", "Android 3.x Honeycomb", "Android 2.3 Gingerbread", "Android 2.2 Froyo", "Android 2.0-2.1 Eclair", "Android 1.6 Donut"],
  "iOS": ["Any version", "iOS 18", "iOS 17", "iOS 16", "iOS 15", "iOS 14", "iOS 13", "iOS 12", "iOS 11", "iOS 10", "iOS 9", "iOS 8", "iOS 7", "iOS 6", "iOS 5", "iOS 4"],
  "KaiOS": ["Any version", "KaiOS 2.5", "KaiOS 3.1"],
  "Windows Phone": ["Any version", "Windows 10", "Windows Phone 8.1", "Windows Phone 8.0", "Windows Phone 7.8", "Windows Phone 7.5 Refresh/Tango", "Windows Phone 7.5 Mango", "Windows Phone 7.0"],
  "Symbian": ["Any version", "Nokia Belle", "Symbian Anna", "Symbian^3", "Symbian S60 5th ed"],
  "RIM": ["Any version", "BlackBerry OS 10", "BlackBerry OS 9", "BlackBerry OS 8", "BlackBerry OS 7"],
  "Bada": ["Any version", "Bada v2.x", "Bada v1.x"],
  "Firefox": ["Any version", "Firefox OS 2.1", "Firefox OS 2.0", "Firefox OS 1.4", "Firefox OS 1.3", "Firefox OS 1.1", "Firefox OS 1.0"],
  "Feature phones": ["Any Version"]
};

const SectionHeader = ({ title }) => (
  <div
    className="px-4 py-2.5 text-xl font-medium text-white"
    style={{
      background:
        "linear-gradient(to right, #0580A5 0%, #3a9dbc 30%, #7ec4d9 60%, #c5e5ef 80%, #ffffff 100%)",
    }}
  >
    {title}
  </div>
);

const sliderCSS = `
.dual-range-wrap { position: relative; height: 24px; display: flex; align-items: center; width: 100%; }
.dual-range-wrap input[type=range] {
  -webkit-appearance: none; appearance: none;
  position: absolute; width: 100%; height: 4px;
  background: transparent; pointer-events: none; margin: 0; top: 50%; transform: translateY(-50%);
}
.dual-range-wrap input[type=range]::-webkit-slider-runnable-track { height: 4px; background: transparent; }
.dual-range-wrap input[type=range]::-moz-range-track { height: 4px; background: transparent; }
.dual-range-wrap input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 16px; height: 16px; border-radius: 50%;
  background: #0580A5; border: 3px solid #b0dde9;
  box-shadow: 0 1px 3px rgba(0,0,0,.2);
  cursor: pointer; pointer-events: auto; margin-top: -6px;
}
.dual-range-wrap input[type=range]::-moz-range-thumb {
  width: 16px; height: 16px; border-radius: 50%;
  background: #0580A5; border: none; box-shadow: 0 1px 3px rgba(0,0,0,.2);
  cursor: pointer; pointer-events: auto;
}
.slider-track {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 100%; height: 4px; background: #e0e0e0; border-radius: 4px;
}
.slider-highlight {
  position: absolute; top: 50%; transform: translateY(-50%);
  height: 4px; background: #034D63; border-radius: 4px;
}
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("advanced-search-range-css")
) {
  const style = document.createElement("style");
  style.id = "advanced-search-range-css";
  style.textContent = sliderCSS;
  document.head.appendChild(style);
}

const parseNumberInput = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const parseCategoryId = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const DEFAULT_ADVANCED_SEARCH_CATEGORY_ID = 1;

const normalizeSearchText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const getSectionGridClass = (sectionTitle, attributeCount) => {
  if (normalizeSearchText(sectionTitle) === "network" && attributeCount >= 4) {
    return "grid grid-cols-2 gap-1.5 sm:grid-cols-4";
  }

  return "grid grid-cols-1 gap-1.5 sm:grid-cols-2";
};

const getFieldWrapperClass = (sectionTitle, attributeCount, attributeIndex) => {
  const isNetworkSection = normalizeSearchText(sectionTitle) === "network";
  const isLastOddItem =
    !isNetworkSection &&
    attributeCount % 2 === 1 &&
    attributeIndex === attributeCount - 1;

  return isLastOddItem ? "sm:col-span-2" : "";
};

const MultiSelectField = ({
  label,
  value,
  onToggle,
  options,
  disabled = false,
  isSingleSelect = false,
  disabledText = "No values available",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    );
  }, [options, query]);

  const optionLookup = useMemo(
    () =>
      new Map(options.map((option) => [String(option.value), option.label])),
    [options],
  );
  const displayValue =
    value.length > 0
      ? value
        .map((selectedValue) => {
          const normalizedValue = String(selectedValue);
          return optionLookup.get(normalizedValue) || normalizedValue;
        })
        .join(", ")
      : "";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          setIsOpen((currentValue) => {
            const nextValue = !currentValue;

            if (!nextValue) {
              setQuery("");
            }

            return nextValue;
          })
        }
        className="relative flex w-full items-center border border-[#0580A5] bg-white disabled:cursor-default disabled:opacity-60"
      >
        <span className="whitespace-nowrap px-3 py-[8px] text-md uppercase tracking-wide">
          {label}:
        </span>
        <span
          className="flex-1 truncate px-3 py-[8px] text-left text-md"
          style={{ paddingRight: "30px" }}
        >
          {disabled ? disabledText : displayValue || "\u00a0"}
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[10px] top-[50%] h-3 w-3 bg-no-repeat"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234a5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
            backgroundPosition: "center",
            backgroundSize: "12px 12px",
            transform: isOpen
              ? "translateY(-50%) rotate(180deg)"
              : "translateY(-50%)",
          }}
        ></span>
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 z-[80] mt-1 border border-[#0580A5] bg-white shadow-lg">
          <div className="border-b border-[#0580A5] p-2">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${label.toLowerCase()}`}
              className="w-full border border-[#0580A5] px-3 py-2 text-sm outline-none"
            />
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No matching values
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);

                return (
                  <button
                    key={`${option.label}-${String(option.value)}`}
                    type="button"
                    onClick={() => {
                      onToggle(option.value);
                      if (isSingleSelect) setIsOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-[#EDF6F9]"
                  >
                    <span className="pr-3">{option.label}</span>
                    <span
                      className={`flex h-4 w-4 items-center justify-center border text-[10px] ${isSelected
                        ? "border-[#0580A5] bg-[#0580A5] text-white"
                        : "border-gray-400 bg-white text-transparent"
                        }`}
                    >
                      ✓
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TextField = ({ label, value, onChange, placeholder = "Type here" }) => (
  <div className="flex items-center border border-[#0580A5] bg-white">
    <span className="whitespace-nowrap px-3 py-[8px] text-md uppercase tracking-wide">
      {label}:
    </span>
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="flex-1 border-none bg-transparent px-3 py-[8px] text-md outline-none"
    />
  </div>
);

const CheckboxRow = ({ label, checked, onChange }) => (
  <div
    className="flex cursor-pointer select-none items-center justify-between border border-[#0580A5] bg-white px-3 py-[8px]"
    onClick={() => onChange(!checked)}
  >
    <span className="whitespace-nowrap text-md uppercase tracking-wide">
      {label}:
    </span>
    <div
      className={`flex h-[18px] w-[18px] items-center justify-center border-2 transition-colors ${checked ? "border-[#0580A5] bg-[#0580A5]" : "border-gray-400 bg-white"
        }`}
    >
      {checked && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  </div>
);

const RangeField = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  prefix = "",
  unit = "",
}) => {
  const [activeHandle, setActiveHandle] = useState(null);
  const minValue = value?.min ?? "";
  const maxValue = value?.max ?? "";
  const safeMinBound = Number.isFinite(min) ? min : 0;
  const safeMaxBound = Number.isFinite(max) ? max : 100;
  const boundedMax =
    safeMaxBound > safeMinBound ? safeMaxBound : safeMinBound + 1;
  const parsedMinValue = parseNumberInput(minValue);
  const parsedMaxValue = parseNumberInput(maxValue);
  const currentMin = Math.max(
    safeMinBound,
    Math.min(parsedMinValue ?? safeMinBound, boundedMax),
  );
  const currentMax = Math.max(
    currentMin,
    Math.min(parsedMaxValue ?? boundedMax, boundedMax),
  );
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
  const minZIndex =
    activeHandle === "min"
      ? 3
      : activeHandle === "max"
        ? 1
        : 2;
  const maxZIndex =
    activeHandle === "max"
      ? 3
      : activeHandle === "min"
        ? 2
        : 1;

  return (
    <div className="flex items-center border border-[#0580A5] bg-white">
      <span className="min-w-[72px] whitespace-nowrap px-2 py-[7px] text-md uppercase tracking-wide">
        {label}:
      </span>
      <input
        type="text"
        value={minValue}
        onChange={(event) => onChange("min", event.target.value)}
        placeholder={`${prefix}${safeMinBound}`}
        className="w-[62px] border-none px-1 py-[5px] text-center text-[11px] outline-none"
      />
      <div className="dual-range-wrap flex-1 px-1">
        <div className="slider-track"></div>
        <div
          className="slider-highlight"
          style={{
            left: `${((currentMin - safeMinBound) / (boundedMax - safeMinBound)) * 100}%`,
            width: `${((currentMax - currentMin) / (boundedMax - safeMinBound)) * 100}%`,
          }}
        ></div>
        <input
          type="range"
          min={safeMinBound}
          max={boundedMax}
          step={safeStep}
          value={currentMin}
          style={{ zIndex: minZIndex }}
          onPointerDown={() => setActiveHandle("min")}
          onPointerUp={() => setActiveHandle(null)}
          onChange={(event) =>
            onChange(
              "min",
              String(Math.min(Number(event.target.value), currentMax)),
            )
          }
        />
        <input
          type="range"
          min={safeMinBound}
          max={boundedMax}
          step={safeStep}
          value={currentMax}
          style={{ zIndex: maxZIndex }}
          onPointerDown={() => setActiveHandle("max")}
          onPointerUp={() => setActiveHandle(null)}
          onChange={(event) =>
            onChange(
              "max",
              String(Math.max(Number(event.target.value), currentMin)),
            )
          }
        />
      </div>
      <input
        type="text"
        value={maxValue}
        onChange={(event) => onChange("max", event.target.value)}
        placeholder={`${prefix}${boundedMax}`}
        className="w-[62px] border-none px-1 py-[5px] text-center text-[11px] outline-none"
      />
      {(prefix || unit) && (
        <span className="pr-2 text-[11px] text-gray-500">
          {prefix}
          {unit}
        </span>
      )}
    </div>
  );
};

const AdvancedSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useMetadata(
    "Advanced Search | Mobirays",
    "Find products with specific features and specifications using our advanced search tool."
  );

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const sharedFilters = useMemo(
    () => decodeAdvancedSearchQuery(searchParams.get("filters")),
    [searchParams],
  );
  const sharedCategoryId = useMemo(
    () => parseCategoryId(searchParams.get("category")),
    [searchParams],
  );
  const { allProducts, allBanners } = useData();
  const {
    sections,
    status: attributesStatus,
  } = useAdvancedSearchAttributes();
  const [filters, setFilters] = useState(sharedFilters);
  const [activeCategoryId, setActiveCategoryId] = useState(
    sharedCategoryId ?? DEFAULT_ADVANCED_SEARCH_CATEGORY_ID,
  );
  const [previewStatus, setPreviewStatus] = useState({
    loading: false,
    error: "",
    count: 0,
  });

  const bannerUrl = useMemo(() => {
    const banner = allBanners.find(
      (item) => item.location === "advancesearch_banner_1",
    );
    return banner?.image || "";
  }, [allBanners]);

  useEffect(() => {
    setFilters(sharedFilters);
  }, [sharedFilters]);

  useEffect(() => {
    if (sharedCategoryId !== null) {
      setActiveCategoryId(sharedCategoryId);
    }
  }, [sharedCategoryId]);

  useEffect(() => {
    if (attributesStatus.error) {
      console.error(
        "Error fetching advanced search attributes:",
        attributesStatus.error,
      );
    }
  }, [attributesStatus.error]);

  const activeTab = useMemo(
    () =>
      getAdvancedSearchTabByCategoryId(activeCategoryId) ||
      getAdvancedSearchTabByCategoryId(DEFAULT_ADVANCED_SEARCH_CATEGORY_ID),
    [activeCategoryId],
  );
  const visibleSections = useMemo(
    () =>
      sections
        .map((section) => ({
          ...section,
          attributes: section.attributes.filter((attribute) =>
            isAdvancedSearchAttributeInCategory(attribute, activeCategoryId),
          ),
        }))
        .filter((section) => section.attributes.length > 0),
    [activeCategoryId, sections],
  );
  const visibleAttributes = useMemo(
    () => visibleSections.flatMap((section) => section.attributes),
    [visibleSections],
  );

  const osFieldKey = useMemo(() => visibleAttributes.find(a => a.name.toLowerCase() === 'os')?.fieldKey, [visibleAttributes]);
  const minOsFieldKey = useMemo(() => visibleAttributes.find(a => a.name.toLowerCase().includes('mini os version') || a.name.toLowerCase().includes('min os version'))?.fieldKey, [visibleAttributes]);

  const selectedOsValues = osFieldKey ? filters[osFieldKey] : null;
  const currentOsStr = Array.isArray(selectedOsValues) && selectedOsValues.length > 0 ? selectedOsValues[0] : "";

  const prevOsRef = useRef(currentOsStr);
  useEffect(() => {
    if (minOsFieldKey && currentOsStr !== prevOsRef.current) {
      prevOsRef.current = currentOsStr;
      if (filters[minOsFieldKey] && filters[minOsFieldKey].length > 0) {
        setFilters(prev => ({ ...prev, [minOsFieldKey]: [] }));
      }
    }
  }, [currentOsStr, minOsFieldKey, filters]);

  const baseCategoryResultCount = useMemo(
    () => filterProductsByCategory(allProducts, activeTab?.label).length,
    [activeTab?.label, allProducts],
  );

  const totalSelectedFilters = useMemo(
    () =>
      visibleAttributes.reduce((total, attribute) => {
        const filterValue =
          filters[attribute.fieldKey] ?? buildInitialFilterValue(attribute);

        if (getResolvedFieldType(attribute) === "multi_select") {
          return total + (Array.isArray(filterValue) ? filterValue.length : 0);
        }

        return total + (isFilterActive(attribute, filterValue) ? 1 : 0);
      }, 0),
    [filters, visibleAttributes],
  );
  const shareableFilters = useMemo(
    () =>
      visibleAttributes.reduce((accumulator, attribute) => {
        const filterValue =
          filters[attribute.fieldKey] ?? buildInitialFilterValue(attribute);

        if (!isFilterActive(attribute, filterValue)) {
          return accumulator;
        }

        accumulator[attribute.fieldKey] = filterValue;
        return accumulator;
      }, {}),
    [filters, visibleAttributes],
  );
  const missingCategoryAttributes = useMemo(
    () =>
      getAdvancedSearchAttributesMissingCategoryIds(visibleAttributes, filters, {
        activeCategoryId,
      }),
    [activeCategoryId, filters, visibleAttributes],
  );

  const advancedRequestCategories = useMemo(
    () =>
      buildAdvancedSearchRequestPayload(visibleAttributes, filters, {
        activeCategoryId,
      }),
    [activeCategoryId, filters, visibleAttributes],
  );

  const localResultCount = useMemo(() => {
    if (attributesStatus.loading) {
      return 0;
    }

    if (totalSelectedFilters === 0) {
      return baseCategoryResultCount;
    }

    const categoryProducts = filterProductsByCategory(
      allProducts,
      activeTab?.label,
    );
    return runAdvancedSearch(categoryProducts, visibleAttributes, filters)
      .length;
  }, [
    activeTab?.label,
    allProducts,
    attributesStatus.loading,
    baseCategoryResultCount,
    filters,
    totalSelectedFilters,
    visibleAttributes,
  ]);

  const resultCount =
    totalSelectedFilters === 0 ? baseCategoryResultCount : localResultCount;

  useEffect(() => {
    if (attributesStatus.loading) {
      return;
    }

    if (totalSelectedFilters === 0) {
      setPreviewStatus({
        loading: false,
        error: "",
        count: baseCategoryResultCount,
      });
      return;
    }

    if (missingCategoryAttributes.length > 0) {
      setPreviewStatus({
        loading: false,
        error: "Selected filters are missing brand_category_id.",
        count: 0,
      });
      return;
    }

    if (advancedRequestCategories.length === 0) {
      setPreviewStatus({
        loading: false,
        error: "Advanced search request is missing category mapping.",
        count: 0,
      });
      return;
    }

    const controller = new AbortController();

    setPreviewStatus((currentStatus) => ({
      ...currentStatus,
      loading: true,
      error: "",
    }));

    const fetchPreviewCount = async () => {
      try {
        const response = await advancedSearchService.getData({
          categories: advancedRequestCategories,
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        const publishedCount = (Array.isArray(response?.data) ? response.data : []).filter(p => {
          const s = typeof p.status === 'object' ? String(p.status?.value || '') : String(p.status || '');
          const statusStr = s.trim().toLowerCase();
          return statusStr !== 'draft' && statusStr !== 'pending' && statusStr !== 'drafts';
        }).length;
        setPreviewStatus({
          loading: false,
          error: "",
          count: publishedCount,
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setPreviewStatus({
          loading: false,
          error:
            error?.data?.message ||
            error?.message ||
            "Failed to load preview count.",
          count: 0,
        });
      }
    };

    void fetchPreviewCount();

    return () => {
      controller.abort();
    };
  }, [
    advancedRequestCategories,
    attributesStatus.loading,
    baseCategoryResultCount,
    missingCategoryAttributes.length,
    totalSelectedFilters,
  ]);

  useEffect(() => {
    if (previewStatus.error) {
      console.error("Error fetching preview count:", previewStatus.error);
    }
  }, [previewStatus.error]);

  const setFilterValue = (fieldKey, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [fieldKey]: value,
    }));
  };

  const toggleMultiSelectValue = (fieldKey, value, isSingleSelect = false) => {
    setFilters((currentFilters) => {
      const currentValues = Array.isArray(currentFilters[fieldKey])
        ? currentFilters[fieldKey]
        : [];

      let nextValues;
      if (isSingleSelect) {
        nextValues = currentValues.includes(value) ? [] : [value];
      } else {
        nextValues = currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value];
      }

      return {
        ...currentFilters,
        [fieldKey]: nextValues,
      };
    });
  };

  const setRangeFilterValue = (fieldKey, bound, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [fieldKey]: {
        ...(currentFilters[fieldKey] || { min: "", max: "" }),
        [bound]: value,
      },
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("advanced", "1");
    params.set("category", String(activeCategoryId));

    if (Object.keys(shareableFilters).length > 0) {
      params.set("filters", encodeAdvancedSearchQuery(shareableFilters));
    }

    navigate({
      pathname: "/search",
      search: params.toString() ? `?${params.toString()}` : "",
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="hidden w-full lg:block lg:w-1/3">
          <div className="flex flex-col gap-2">
            <SidebarIntro />
            <SidebarBrands />
            <SidebarFilters />
            <SidebarBanner1 />
            <div className="flex flex-col gap-6">
              <SidebarStats />
              <SidebarBanner2 />
              <SidebarLatestModels />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-3/4">
          <HeroBanner />

          <div className="mb-0 overflow-visible bg-white">
            <div className="relative mb-3 flex w-full items-end gap-1">
              {attributesStatus.error && (
                <div className="mx-2 mb-4 border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700">
                  {attributesStatus.error}
                </div>
              )}

              {!attributesStatus.error && previewStatus.error && (
                <div className="mx-2 mb-4 border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700">
                  {previewStatus.error}
                </div>
              )}

              {!attributesStatus.error && (
                <div className="overflow-x-auto">
                  <div className="flex min-w-max items-end gap-1">
                    {ADVANCED_SEARCH_TABS.filter(
                      (tab) => tab.id !== activeCategoryId,
                    ).map((tab) => {
                      const isActive = tab.id === activeCategoryId;

                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveCategoryId(tab.id)}
                          className={`px-2 sm:px-4 cursor-pointer flex items-center justify-center h-10 sm:h-14 text-sm font-medium tracking-wide transition-colors sm:text-xl ${isActive
                            ? "bg-[#0580A5] text-white"
                            : "bg-[#0580A5] text-white hover:text-[#034D63] hover:bg-[#70bad1]"
                            }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="relative flex-1">
                <div className="absolute bottom-0 left-0 h-[10px] w-full bg-[#0580A5] sm:h-[16px]"></div>
                <div className="latest-products-clip relative z-10 flex h-10 w-fit items-center bg-[#0580A5] text-[#1f4e75] sm:h-14">
                  <h2 className="pl-2 font-medium text-sm sm:pl-4 sm:text-xl">
                    {activeTab?.label} Discover
                  </h2>
                </div>
              </div>
            </div>

            {!attributesStatus.error && attributesStatus.loading && (
              <div className="px-4 py-8 text-center text-gray-500">
                Loading advanced search filters...
              </div>
            )}

            {!attributesStatus.loading &&
              !attributesStatus.error &&
              visibleSections.map((section) => (
                <div key={section.title}>
                  <SectionHeader title={section.title} />
                  <div className="space-y-1.5 px-2 py-5 pb-10 text-sm">
                    <div
                      className={getSectionGridClass(
                        section.title,
                        section.attributes.length,
                      )}
                    >
                      {section.attributes.map((attribute, attributeIndex) => (
                        <div
                          key={attribute.fieldKey}
                          className={getFieldWrapperClass(
                            section.title,
                            section.attributes.length,
                            attributeIndex,
                          )}
                        >
                          {getResolvedFieldType(attribute) === "range" ? (
                            <RangeField
                              label={attribute.name}
                              value={
                                filters[attribute.fieldKey] ??
                                buildInitialFilterValue(attribute)
                              }
                              onChange={(bound, value) =>
                                setRangeFilterValue(
                                  attribute.fieldKey,
                                  bound,
                                  value,
                                )
                              }
                              min={attribute.min ?? 0}
                              max={attribute.max ?? 100}
                              step={getRangeFieldConfig(attribute).step}
                              prefix={getRangeFieldConfig(attribute).prefix}
                            />
                          ) : getResolvedFieldType(attribute) === "text" ? (
                            <TextField
                              label={attribute.name}
                              value={filters[attribute.fieldKey] || ""}
                              onChange={(value) =>
                                setFilterValue(attribute.fieldKey, value)
                              }
                              placeholder={attribute.placeholder || "Type here"}
                            />
                          ) : getResolvedFieldType(attribute) === "checkbox" ? (
                            <CheckboxRow
                              label={attribute.name}
                              checked={filters[attribute.fieldKey] === "True"}
                              onChange={(checked) =>
                                setFilterValue(
                                  attribute.fieldKey,
                                  checked ? "True" : "",
                                )
                              }
                            />
                          ) : (() => {
                            const isOs = attribute.name.toLowerCase() === 'os';
                            const isMinOs = attribute.name.toLowerCase().includes('mini os version') || attribute.name.toLowerCase().includes('min os version');
                            const isSingleSelect = isOs || isMinOs;

                            let displayOptions = attribute.options;
                            let localDisabled = attribute.options.length === 0;

                            if (isMinOs) {
                              if (!currentOsStr) {
                                localDisabled = true;
                                displayOptions = [];
                              } else {
                                const mapKey = Object.keys(OS_VERSION_MAP).find(k => k.toLowerCase() === String(currentOsStr).toLowerCase());
                                if (mapKey) {
                                  const allowedVersions = OS_VERSION_MAP[mapKey].map(v => v.toLowerCase());
                                  displayOptions = attribute.options
                                    .filter(opt => allowedVersions.includes(String(opt.label).toLowerCase()))
                                    .sort((a, b) => {
                                      const idxA = allowedVersions.indexOf(String(a.label).toLowerCase());
                                      const idxB = allowedVersions.indexOf(String(b.label).toLowerCase());
                                      return idxA - idxB;
                                    });
                                } else {
                                  displayOptions = [];
                                }
                              }
                            }

                            return (
                              <MultiSelectField
                                label={attribute.name}
                                value={filters[attribute.fieldKey] ?? []}
                                onToggle={(value) =>
                                  toggleMultiSelectValue(
                                    attribute.fieldKey,
                                    value,
                                    isSingleSelect
                                  )
                                }
                                options={displayOptions}
                                disabled={localDisabled || displayOptions.length === 0}
                                isSingleSelect={isSingleSelect}
                                disabledText={isMinOs && !currentOsStr ? "Select an OS First" : "No values available"}
                              />
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

            {!attributesStatus.loading &&
              !attributesStatus.error &&
              visibleSections.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  No advanced search filters available for {activeTab?.label}.
                </div>
              )}

            <div className="flex items-center justify-center gap-3 px-4 py-5">
              <span className="border-[2px] border-[#0580A5] rounded-l-full px-4 sm:px-4 py-2 text-xl sm:text-3xl flex items-center whitespace-nowrap">
                Result
              </span>
              <span className="border-[2px] border-l-2 border-[#0580A5] px-6 sm:px-8 text-xl sm:text-3xl py-2 flex items-center">
                {previewStatus.loading ? "..." : previewStatus.count.toLocaleString()}
              </span>
              <button
                onClick={handleSearch}
                className="bg-[#0580A5] hover:bg-[#046a88] text-white border-[2px] border-l-0 border-[#0580A5] font-light px-5 sm:px-6 py-2 text-xl sm:text-3xl transition-colors cursor-pointer rounded-r-full whitespace-nowrap"
              >
                SHOW ALL
                {totalSelectedFilters > 0 ? ` (${totalSelectedFilters})` : ""}
              </button>
            </div>
          </div>

          <div className="space-y-4 px-2 py-6 leading-relaxed">
            <p>
              *PRICE BASED ON THE LOWEST ONLINE SIM-FREE PRICE, EXCLUDING TAXES,
              SUBSIDIES AND SHIPMENT. ONLY PHONES WITH KNOWN PRICES WILL APPEAR
              IN THE RESULTS.
            </p>
            <p>
              *BATTERY STAND-BY AND TALK TIME BASED ON THE OFFICIAL MANUFACTURER
              SPECIFICATIONS, NOT ON REAL-LIFE TESTS
            </p>
            <p>
              *IN FREE TEXT FIELD YOU CAN SEARCH FOR OTHER FEATURES, NOT
              MENTIONED ABOVE. FOR EXAMPLE - "FAST BATTERY CHARGING", "WIRELESS
              CHARGING", "POWER BANK", "ANT+", "GALILEO", "APTX" AND SO ON. IN
              SOME CASES IT CAN BE VERY USEFUL, BUT THE RESULTS ARE LESS
              RELIABLE.
            </p>
          </div>

          {bannerUrl && (
            <img
              className="mt-7 w-auto sm:w-full"
              src={bannerUrl}
              alt="Advanced Search Banner"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
