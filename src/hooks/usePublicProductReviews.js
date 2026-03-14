import { useEffect, useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import { productReviewService } from "../services/productReviewService";
import {
  getProductReviewErrorMessage,
  normalizeMemberProductReview,
} from "../utils/productReview";
import { createSlug } from "../utils/urlHelper";

const ITEMS_PER_PAGE = 9;

export const usePublicProductReviews = (searchQuery) => {
  const { allProducts } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchPublicReviews = async () => {
      setStatus({
        loading: true,
        error: "",
      });

      try {
        const data = await productReviewService.getAllPublicReviews();

        if (!isMounted) return;

        setReviews(data.map(normalizeMemberProductReview));
        setStatus({
          loading: false,
          error: "",
        });
      } catch (error) {
        if (!isMounted) return;

        setReviews([]);
        setStatus({
          loading: false,
          error: getProductReviewErrorMessage(error),
        });
      }
    };

    fetchPublicReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const productsById = useMemo(
    () => new Map(allProducts.map((product) => [product.id, product])),
    [allProducts],
  );

  const normalizedReviews = useMemo(() => {
    return reviews.map((review) => {
      const matchedProduct = productsById.get(review.productId);

      return {
        ...review,
        productImage: review.productImage || matchedProduct?.image || null,
        productSlug: matchedProduct?.slug || createSlug(review.productName),
        productData: matchedProduct || null,
        displayRating: Math.min(review.rating * 2, 10),
      };
    });
  }, [productsById, reviews]);

  const filteredReviews = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return normalizedReviews;

    return normalizedReviews.filter(
      (review) =>
        review.title.toLowerCase().includes(normalizedQuery) ||
        review.productName.toLowerCase().includes(normalizedQuery) ||
        review.author.toLowerCase().includes(normalizedQuery) ||
        review.reviewText.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedReviews, searchQuery]);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const resolvedCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const indexOfLastItem = resolvedCurrentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);

  return {
    currentReviews,
    currentPage: resolvedCurrentPage,
    totalPages,
    status,
    filteredCount: filteredReviews.length,
    setCurrentPage,
  };
};
