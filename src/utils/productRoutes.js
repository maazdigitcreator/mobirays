import { createSlug } from "./urlHelper";

export const getProductDetailPath = (product) => {
  const productId = Number(
    product?.id ?? product?.product_id ?? product?.product?.id,
  );
  const productSlug = product?.slug || createSlug(product?.name || "product");
  const resolvedProductId =
    Number.isFinite(productId) && productId > 0 ? productId : 0;

  return `/product/${resolvedProductId}/${productSlug}`;
};
