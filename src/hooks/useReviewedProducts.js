import { useEffect, useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import { productReviewService } from "../services/productReviewService";
import {
  getProductReviewErrorMessage,
  normalizeMemberProductReview,
} from "../utils/productReview";

const ITEMS_PER_PAGE = 5;

export const useReviewedProducts = (products) => {
  const { allProducts } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedReviews, setFetchedReviews] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      return;
    }

    let isMounted = true;

    const fetchMemberReviews = async () => {
      setStatus({
        loading: true,
        error: "",
      });

      try {
        const response = await productReviewService.getMemberReviews();
        const data = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

        if (!isMounted) return;

        setFetchedReviews(data.map(normalizeMemberProductReview));
        setStatus({
          loading: false,
          error: "",
        });
      } catch (error) {
        if (!isMounted) return;

        setFetchedReviews([]);
        setStatus({
          loading: false,
          error: getProductReviewErrorMessage(error),
        });
      }
    };

    fetchMemberReviews();

    return () => {
      isMounted = false;
    };
  }, [products]);

  const reviews = useMemo(() => {
    if (Array.isArray(products) && products.length > 0) {
      return products.map(normalizeMemberProductReview);
    }

    return fetchedReviews;
  }, [fetchedReviews, products]);

  const productImagesById = useMemo(
    () =>
      new Map(
        allProducts.map((product) => [Number(product.id), product.image || null]),
      ),
    [allProducts],
  );

  const reviewsWithResolvedImages = useMemo(
    () =>
      reviews.map((review) => ({
        ...review,
        productImage: review.productImage || productImagesById.get(review.productId) || null,
      })),
    [productImagesById, reviews],
  );

  const filteredReviews = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return reviewsWithResolvedImages;

    return reviewsWithResolvedImages.filter(
      (review) =>
        review.title.toLowerCase().includes(normalizedQuery) ||
        review.productName.toLowerCase().includes(normalizedQuery) ||
        review.author.toLowerCase().includes(normalizedQuery) ||
        review.reviewText.toLowerCase().includes(normalizedQuery),
    );
  }, [reviewsWithResolvedImages, searchQuery]);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const resolvedCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const indexOfLastItem = resolvedCurrentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return {
    currentReviews,
    currentPage: resolvedCurrentPage,
    searchQuery,
    status,
    totalPages,
    setCurrentPage,
    handleSearchChange,
  };
};
