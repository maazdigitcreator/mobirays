import { useEffect, useMemo, useState } from "react";
import { useData } from "../context/useData";
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
  const [editingReview, setEditingReview] = useState(null);
  const [editStatus, setEditStatus] = useState({ loading: false, error: "" });
  const [deletingId, setDeletingId] = useState(null);

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

  const productsById = useMemo(
    () => new Map(allProducts.map((product) => [Number(product.id), product])),
    [allProducts],
  );

  const reviewsWithResolvedProducts = useMemo(
    () =>
      reviews.map((review) => {
        const matchedProduct = productsById.get(review.productId) || null;
        return {
          ...review,
          productImage: review.productImage || matchedProduct?.image || null,
          product: matchedProduct,
        };
      }),
    [productsById, reviews],
  );

  const filteredReviews = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return reviewsWithResolvedProducts;

    return reviewsWithResolvedProducts.filter(
      (review) =>
        review.title.toLowerCase().includes(normalizedQuery) ||
        review.productName.toLowerCase().includes(normalizedQuery) ||
        review.author.toLowerCase().includes(normalizedQuery) ||
        review.reviewText.toLowerCase().includes(normalizedQuery),
    );
  }, [reviewsWithResolvedProducts, searchQuery]);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const resolvedCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const indexOfLastItem = resolvedCurrentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentReviews = filteredReviews.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleEditOpen = (review) => {
    setEditingReview(review);
    setEditStatus({ loading: false, error: "" });
  };

  const handleEditClose = () => {
    setEditingReview(null);
    setEditStatus({ loading: false, error: "" });
  };

  const handleEditSubmit = async ({ title, content, rating }) => {
    setEditStatus({ loading: true, error: "" });
    try {
      await productReviewService.update(editingReview.id, { title, content, rating });
      setFetchedReviews((prev) =>
        prev.map((r) =>
          r.id === editingReview.id ? { ...r, title, reviewText: content, rating } : r
        )
      );
      setEditingReview(null);
      setEditStatus({ loading: false, error: "" });
    } catch (error) {
      setEditStatus({ loading: false, error: getProductReviewErrorMessage(error) });
    }
  };

  const handleDelete = async (reviewId) => {
    setDeletingId(reviewId);
    try {
      await productReviewService.delete(reviewId);
      setFetchedReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        error: getProductReviewErrorMessage(error),
      }));
    } finally {
      setDeletingId(null);
    }
  };

  return {
    currentReviews,
    currentPage: resolvedCurrentPage,
    searchQuery,
    status,
    totalPages,
    setCurrentPage,
    handleSearchChange,
    editingReview,
    editStatus,
    handleEditOpen,
    handleEditClose,
    handleEditSubmit,
    deletingId,
    handleDelete,
  };
};
