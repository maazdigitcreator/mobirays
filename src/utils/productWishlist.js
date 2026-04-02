export const normalizeWishlistProduct = (wishlist, matchedProduct) => {
  const productId = Number(wishlist?.product) || null;
  const productName = matchedProduct?.name || wishlist?.product_name || "Unknown Product";

  return {
    id: wishlist?.id,
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

export const getProductWishlistErrorMessage = (error) => {
  const apiError = error?.data || error;
  return apiError?.message || "Failed to load wishlist products.";
};
