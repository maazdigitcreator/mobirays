import { useMemo } from "react";
import { useData } from "../context/useData";

export const useSidebarVisitorStats = () => {
  const { productVisitorTotals, productVisitorTotalsStatus } = useData();

  const visitorDevices = useMemo(
    () =>
      [...productVisitorTotals]
        .sort((a, b) => Number(b.visited_count) - Number(a.visited_count))
        .slice(0, 8)
        .map((device) => ({
          id: device.id,
          name: device.name,
          slug: device.slug,
          visitedCount: Number(device.visited_count),
        })),
    [productVisitorTotals],
  );

  return {
    visitorDevices,
    status: {
      loading: productVisitorTotalsStatus.loading,
      error: productVisitorTotalsStatus.error,
    },
  };
};
