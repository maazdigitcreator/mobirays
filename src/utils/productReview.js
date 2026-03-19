export const formatReviewDate = (value) => {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const normalizeMemberProductReview = (review) => ({
  id: review?.id,
  productId: Number(review?.product_id || review?.product?.id || review?.product),
  productName:
    review?.product?.name ||
    review?.product_name ||
    review?.name ||
    "Unknown Product",
  title: review?.title || review?.product_name || review?.name || "Untitled Review",
  productImage: review?.product?.image || review?.product_image || review?.image || null,
  author:
    review?.user_name ||
    review?.user?.name ||
    review?.member?.name ||
    review?.author ||
    "Mobirays Member",
  date: formatReviewDate(review?.created_at || review?.updated_at || review?.date),
  rating: Math.max(0, Math.min(5, Number.parseInt(review?.rating, 10) || 0)),
  reviewText: review?.content || review?.review || review?.description || "",
});

export const getProductReviewErrorMessage = (error) => {
  const apiError = error?.data || error;
  if (apiError?.errors) {
    const firstError = Object.values(apiError.errors).flat()[0];
    if (firstError) return firstError;
  }

  return apiError?.message || "Failed to load reviewed products.";
};
