import { useEffect, useMemo, useReducer, useState } from "react";
import { formatReviewDate } from "../utils/productReview";
import { newsDiscussionService } from "../services/newsDiscussionService";

const VISIBLE_DISCUSSIONS_LIMIT = 5;

const mapNewsDiscussion = (discussion) => ({
  id: discussion.id,
  title: discussion.title,
  content: discussion.content,
  author: discussion.user_name || discussion.user?.name || "Anonymous",
  createdAt: discussion.created_at,
  date: formatReviewDate(discussion.created_at),
  rating: Number.parseInt(discussion.rating, 10) || 0,
});

const getNewsDiscussionErrorMessage = (error) => {
  const message = error?.data?.message || error?.message;

  if (message?.includes("SQLSTATE")) {
    return "No reviews available right now.";
  }

  return message || "Failed to load reviews.";
};

export const useNewsDiscussions = (newsId) => {
  const [discussions, setDiscussions] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });
  const [refreshKey, refreshDiscussions] = useReducer((value) => value + 1, 0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDiscussions = async () => {
      if (!newsId) {
        setDiscussions([]);
        setStatus({
          loading: false,
          error: "",
        });
        return;
      }

      setStatus({
        loading: true,
        error: "",
      });

      try {
        const data = await newsDiscussionService.getByNewsId(newsId, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        const nextDiscussions = (data || [])
          .map(mapNewsDiscussion)
          .sort(
            (firstDiscussion, secondDiscussion) =>
              new Date(secondDiscussion.createdAt).getTime() -
              new Date(firstDiscussion.createdAt).getTime(),
          );

        setDiscussions(nextDiscussions);
        setStatus({
          loading: false,
          error: "",
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setDiscussions([]);
        setStatus({
          loading: false,
          error: getNewsDiscussionErrorMessage(error),
        });
      }
    };

    void fetchDiscussions();

    return () => {
      controller.abort();
    };
  }, [newsId, refreshKey]);

  const stats = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    discussions.forEach((discussion) => {
      if (counts[discussion.rating] !== undefined) {
        counts[discussion.rating] += 1;
      }
      totalRating += discussion.rating;
    });

    const totalDiscussions = discussions.length;

    return {
      averageRating:
        totalDiscussions > 0
          ? (totalRating / totalDiscussions).toFixed(1)
          : "0.0",
      counts,
      totalDiscussions,
    };
  }, [discussions]);

  const visibleDiscussions = useMemo(
    () => discussions.slice(0, VISIBLE_DISCUSSIONS_LIMIT),
    [discussions],
  );

  return {
    discussions,
    visibleDiscussions,
    status,
    stats,
    refreshDiscussions,
  };
};
