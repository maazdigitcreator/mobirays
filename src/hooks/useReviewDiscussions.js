import { useEffect, useMemo, useReducer, useState } from "react";
import { formatReviewDate } from "../utils/productReview";
import { reviewDiscussionService } from "../services/reviewDiscussionService";

const VISIBLE_DISCUSSIONS_LIMIT = 5;

const mapReviewDiscussion = (discussion) => ({
  id: discussion.id,
  title: discussion.title,
  content: discussion.content,
  author: discussion.user_name,
  createdAt: discussion.created_at,
  date: formatReviewDate(discussion.created_at),
  rating: Number.parseInt(discussion.rating, 10),
});

const getReviewDiscussionErrorMessage = (error) => {
  const message = error?.data?.message || error?.message;

  if (message.includes("SQLSTATE")) {
    return "No reviews available right now.";
  }

  return message || "Failed to load reviews.";
};

export const useReviewDiscussions = (reviewId) => {
  const [discussions, setDiscussions] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });
  const [refreshKey, refreshDiscussions] = useReducer((value) => value + 1, 0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDiscussions = async () => {
      if (!reviewId) {
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
        const data = await reviewDiscussionService.getByReviewId(reviewId, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        const nextDiscussions = data
          .map(mapReviewDiscussion)
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
          error: getReviewDiscussionErrorMessage(error),
        });
      }
    };

    void fetchDiscussions();

    return () => {
      controller.abort();
    };
  }, [reviewId, refreshKey]);

  const stats = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    discussions.forEach((discussion) => {
      counts[discussion.rating] += 1;
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
