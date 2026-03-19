import { useEffect, useState } from "react";
import { productLikeService } from "../services/productLikeService";

const getSidebarLikeStatsErrorMessage = (error) => {
  const apiError = error?.data || error;
  return apiError?.message || "Failed to load device likes.";
};

export const useSidebarLikeStats = () => {
  const [likedDevices, setLikedDevices] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchLikedDevices = async () => {
      setStatus({
        loading: true,
        error: "",
      });

      try {
        const data = await productLikeService.getTotalLikes({
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        setLikedDevices(
          data.map((device) => ({
            id: device.id,
            name: device.name,
            likesCount: Number(device.likes_count),
          })),
        );
        setStatus({
          loading: false,
          error: "",
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLikedDevices([]);
        setStatus({
          loading: false,
          error: getSidebarLikeStatsErrorMessage(error),
        });
      }
    };

    void fetchLikedDevices();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    likedDevices,
    status,
  };
};
