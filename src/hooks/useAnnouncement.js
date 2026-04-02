import { useEffect, useState } from "react";
import { announcementService } from "../services/announcementService";

const SESSION_STORAGE_KEY = "mobirays_announcement_seen";

/**
 * Custom hook to manage the announcement modal state.
 * Shows the modal once per browser tab session if a new announcement is available.
 */
export const useAnnouncement = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAnnouncement = async () => {
      setLoading(true);
      try {
        const response = await announcementService.getLatestAnnouncement(
          controller.signal,
        );
        const data = response?.data?.[0]; // Get the first announcement

        if (data && data.id) {
          const seenId = sessionStorage.getItem(SESSION_STORAGE_KEY);
          
          // Show only if this specific ID hasn't been seen in this session
          if (seenId !== String(data.id)) {
            setAnnouncement(data);
            setIsOpen(true);
          }
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch announcement:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();

    return () => {
      controller.abort();
    };
  }, []);

  const closeAnnouncement = () => {
    if (announcement?.id) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, String(announcement.id));
    }
    setIsOpen(false);
  };

  return {
    announcement,
    isOpen,
    loading,
    closeAnnouncement,
  };
};
