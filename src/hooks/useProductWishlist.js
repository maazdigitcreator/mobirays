import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useData } from "../context/useData";
import { wishlistService } from "../services/wishlistService";

const AUTH_REQUIRED_CODE = "AUTH_REQUIRED";

export const useProductWishlist = ({ productId, initialWishlistCount }) => {
  const { user } = useAuth();
  const { productWishlistTotals, productWishlistTotalsStatus, setProductWishlistTotalCount } = useData();

  const initialCount = Number.parseInt(initialWishlistCount, 10) || 0;
  const productWishlistTotal = productWishlistTotals.find((p) => Number(p.id) === Number(productId)) || null;

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(() => Number(productWishlistTotal?.wishlist_count) || initialCount);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistReady, setWishlistReady] = useState(() => !user);
  const toggleLockRef = useRef(false);

  // Sync count when totals load from context
  useEffect(() => {
    setWishlistCount(Number(productWishlistTotal?.wishlist_count) || initialCount);
  }, [initialCount, productId, productWishlistTotal?.wishlist_count]);

  // Fetch user's wishlist status
  useEffect(() => {
    if (!productId) return;

    setWishlistReady(false);

    if (!user) {
      setIsWishlisted(false);
      setWishlistReady(true);
      return;
    }

    const controller = new AbortController();

    wishlistService
      .getAllWishlist({ signal: controller.signal })
      .then((wishlistItems) => {
        if (controller.signal.aborted) return;
        setIsWishlisted(wishlistItems.some((item) => Number(item.product) === Number(productId)));
        setWishlistReady(true);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setIsWishlisted(false);
        setWishlistReady(true);
      });

    return () => controller.abort();
  }, [productId, user]);

  const toggleWishlist = async () => {
    if (!productId || !wishlistReady || wishlistLoading || toggleLockRef.current) return;

    if (!user) {
      const error = new Error("Please login to add products to your wishlist.");
      error.code = AUTH_REQUIRED_CODE;
      throw error;
    }

    const previousWishlisted = isWishlisted;
    const previousCount = wishlistCount;
    const nextWishlisted = !previousWishlisted;
    const nextCount = Math.max(0, previousCount + (previousWishlisted ? -1 : 1));

    setWishlistLoading(true);
    toggleLockRef.current = true;
    setIsWishlisted(nextWishlisted);
    setWishlistCount(nextCount);
    setProductWishlistTotalCount(productId, nextCount);

    try {
      const response = await wishlistService.toggle(productId);
      // The API might return 'wishlisted', 'liked', or some other field, or just success.
      // We check for a truthy value if the field exists, otherwise we trust our optimistic update.
      const confirmedWishlisted = response.wishlisted !== undefined ? Boolean(response.wishlisted) : nextWishlisted;

      if (confirmedWishlisted !== nextWishlisted) {
        const confirmedCount = Math.max(0, previousCount + (confirmedWishlisted ? 1 : -1));
        setIsWishlisted(confirmedWishlisted);
        setWishlistCount(confirmedCount);
        setProductWishlistTotalCount(productId, confirmedCount);
      }
    } catch (error) {
      setIsWishlisted(previousWishlisted);
      setWishlistCount(previousCount);
      setProductWishlistTotalCount(productId, previousCount);
      throw error;
    } finally {
      setWishlistLoading(false);
      toggleLockRef.current = false;
    }
  };

  return {
    isWishlisted,
    wishlistCount,
    wishlistLoading,
    wishlistReady: wishlistReady && !productWishlistTotalsStatus.loading,
    toggleWishlist,
    authRequiredCode: AUTH_REQUIRED_CODE,
  };
};
