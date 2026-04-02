import { useMemo } from "react";
import { useData } from "../context/useData";

export const useSidebarLikeStats = () => {
  const { productLikeTotals, productLikeTotalsStatus } = useData();

  const likedDevices = useMemo(
    () =>
      [...productLikeTotals]
        .sort((a, b) => Number(b.likes_count) - Number(a.likes_count))
        .slice(0, 8)
        .map((device) => ({
          id: device.id,
          name: device.name,
          slug: device.slug,
          likesCount: Number(device.likes_count),
        })),
    [productLikeTotals],
  );

  return {
    likedDevices,
    status: {
      loading: productLikeTotalsStatus.loading,
      error: productLikeTotalsStatus.error,
    },
  };
};
