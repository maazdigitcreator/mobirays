export const normalizeLikedProduct = (like, matchedProduct) => {
  const productId = Number(like?.product) || null;
  const productName = matchedProduct?.name || like?.product_name || "Unknown Product";

  return {
    id: like?.id,
    productId,
    name: productName,
    slug: matchedProduct?.slug || null,
    image: matchedProduct?.image || null,
    isComingSoon: Boolean(matchedProduct?.is_coming_soon),
    product:
      matchedProduct || {
      id: productId,
      name: productName,
      slug: null,
      image: null,
      is_coming_soon: false,
    },
  };
};

export const getProductLikeErrorMessage = (error) => {
  const apiError = error?.data || error;
  return apiError?.message || "Failed to load liked products.";
};
