import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useData } from "../context/useData";
import { productLikeService } from "../services/productLikeService";

const AUTH_REQUIRED_CODE = "AUTH_REQUIRED";

export const useProductLike = ({ productId, initialLikesCount }) => {
  const { user } = useAuth();
  const { productLikeTotals, productLikeTotalsStatus, setProductLikeTotalCount } = useData();

  const initialCount = Number.parseInt(initialLikesCount, 10) || 0;
  const productLikeTotal = productLikeTotals.find((p) => Number(p.id) === Number(productId)) || null;

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(() => Number(productLikeTotal?.likes_count) || initialCount);
  const [likesLoading, setLikesLoading] = useState(false);
  const [likesReady, setLikesReady] = useState(() => !user);
  const toggleLockRef = useRef(false);

  // Sync count when totals load from context
  useEffect(() => {
    setLikesCount(Number(productLikeTotal?.likes_count) || initialCount);
  }, [initialCount, productId, productLikeTotal?.likes_count]);

  // Fetch user's liked status
  useEffect(() => {
    if (!productId) return;

    setLikesReady(false);

    if (!user) {
      setIsLiked(false);
      setLikesReady(true);
      return;
    }

    const controller = new AbortController();

    productLikeService
      .getAllLikes({ signal: controller.signal })
      .then((likedItems) => {
        if (controller.signal.aborted) return;
        setIsLiked(likedItems.some((item) => Number(item.product) === Number(productId)));
        setLikesReady(true);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setIsLiked(false);
        setLikesReady(true);
      });

    return () => controller.abort();
  }, [productId, user]);

  const toggleLike = async () => {
    if (!productId || !likesReady || likesLoading || toggleLockRef.current) return;

    if (!user) {
      const error = new Error("Please login to like products.");
      error.code = AUTH_REQUIRED_CODE;
      throw error;
    }

    const previousLiked = isLiked;
    const previousCount = likesCount;
    const nextLiked = !previousLiked;
    const nextCount = Math.max(0, previousCount + (previousLiked ? -1 : 1));

    setLikesLoading(true);
    toggleLockRef.current = true;
    setIsLiked(nextLiked);
    setLikesCount(nextCount);
    setProductLikeTotalCount(productId, nextCount);

    try {
      const response = await productLikeService.toggle(productId);
      const confirmedLiked = Boolean(response.liked);

      if (confirmedLiked !== nextLiked) {
        const confirmedCount = Math.max(0, previousCount + (confirmedLiked ? 1 : -1));
        setIsLiked(confirmedLiked);
        setLikesCount(confirmedCount);
        setProductLikeTotalCount(productId, confirmedCount);
      }
    } catch (error) {
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      setProductLikeTotalCount(productId, previousCount);
      throw error;
    } finally {
      setLikesLoading(false);
      toggleLockRef.current = false;
    }
  };

  return {
    isLiked,
    likesCount,
    likesLoading,
    likesReady: likesReady && !productLikeTotalsStatus.loading,
    toggleLike,
    authRequiredCode: AUTH_REQUIRED_CODE,
  };
};
