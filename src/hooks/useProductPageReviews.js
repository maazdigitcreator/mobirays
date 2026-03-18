import { useEffect, useMemo, useReducer, useState } from "react";
import { productReviewService } from "../services/productReviewService";
import {
  formatReviewDate,
  getProductReviewErrorMessage,
} from "../utils/productReview";

const REVIEW_CARD_LIMIT = 5;

const mapProductReview = (review) => ({
  id: review.id,
  title: review.title,
  content: review.content,
  author: review.user_name,
  createdAt: review.created_at,
  date: formatReviewDate(review.created_at),
  rating: Math.min(5, Number.parseInt(review.rating, 10)),
});

export const useProductPageReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });
  const [refreshKey, refreshReviews] = useReducer((value) => value + 1, 0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProductReviews = async () => {
      if (!productId) {
        setReviews([]);
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
        const data = await productReviewService.getAllPublicReviewsByProduct(
          productId,
          {
            signal: controller.signal,
          },
        );

        if (controller.signal.aborted) {
          return;
        }

        const nextReviews = data
          .map(mapProductReview)
          .sort(
            (firstReview, secondReview) =>
              new Date(secondReview.createdAt).getTime() -
              new Date(firstReview.createdAt).getTime(),
          );

        setReviews(nextReviews);
        setStatus({
          loading: false,
          error: "",
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setReviews([]);
        setStatus({
          loading: false,
          error: getProductReviewErrorMessage(error),
        });
      }
    };

    void fetchProductReviews();

    return () => {
      controller.abort();
    };
  }, [productId, refreshKey]);

  const stats = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    reviews.forEach((review) => {
      counts[review.rating] += 1;
      totalRating += review.rating;
    });

    const totalReviews = reviews.length;

    return {
      averageRating:
        totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "0.0",
      counts,
      totalReviews,
    };
  }, [reviews]);

  const visibleReviews = useMemo(
    () => reviews.slice(0, REVIEW_CARD_LIMIT),
    [reviews],
  );

  return {
    stats,
    status,
    reviews,
    visibleReviews,
    refreshReviews,
  };
};
