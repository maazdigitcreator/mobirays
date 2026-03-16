import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/useAuth";
import { productLikeService } from "../services/productLikeService";

const AUTH_REQUIRED_CODE = "AUTH_REQUIRED";

const getUserKey = (user) => String(user?.id || user?.email || "guest");
const getStorageKey = (userKey) => `mobirays_product_likes_${userKey}`;
const parseCount = (value) => Number.parseInt(value, 10) || 0;

const readStoredLikes = (userKey) => {
  if (!userKey || userKey === "guest") {
    return {};
  }

  try {
    const stored = localStorage.getItem(getStorageKey(userKey));
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const writeStoredLikes = (userKey, value) => {
  if (!userKey || userKey === "guest") {
    return;
  }

  localStorage.setItem(getStorageKey(userKey), JSON.stringify(value));
};

const buildStoredLikesMap = (items, existingLikes = {}) =>
  items.reduce((acc, item) => {
    const productId = Number(item?.product?.id || item?.product_id || item?.product || item?.id);
    if (productId) {
      acc[productId] = {
        ...acc[productId],
        isLiked: true,
      };
    }
    return acc;
  }, { ...existingLikes });

export const useProductLike = ({ productId, initialLikesCount }) => {
  const { user } = useAuth();
  const userKey = getUserKey(user);
  const initialCount = parseCount(initialLikesCount);
  const storedLikes = readStoredLikes(userKey);
  const storedProductLike = storedLikes[productId] || null;

  const [isLiked, setIsLiked] = useState(() => Boolean(user && storedProductLike?.isLiked));
  const [likesCount, setLikesCount] = useState(
    () => storedProductLike?.likesCount ?? initialCount,
  );
  const [likesLoading, setLikesLoading] = useState(false);
  const [likesReady, setLikesReady] = useState(() => !user);
  const toggleLockRef = useRef(false);

  useEffect(() => {
    if (!productId) {
      return;
    }

    const nextStoredLikes = readStoredLikes(userKey);
    const nextStoredProductLike = nextStoredLikes[productId];

    setLikesCount(nextStoredProductLike?.likesCount ?? initialCount);

    if (!user) {
      setIsLiked(false);
      setLikesReady(true);
      return;
    }

    let isMounted = true;
    setLikesReady(false);

    const loadLikes = async () => {
      try {
        const likedItems = await productLikeService.getAllLikes();

        if (!isMounted) {
          return;
        }

        const currentStoredLikes = readStoredLikes(userKey);
        const nextLikes = buildStoredLikesMap(likedItems, currentStoredLikes);
        const isCurrentProductLiked = Boolean(
          likedItems.some((item) => {
            const likedProductId = Number(
              item?.product?.id || item?.product_id || item?.product || item?.id,
            );
            return likedProductId === Number(productId);
          }),
        );

        nextLikes[productId] = {
          isLiked: isCurrentProductLiked,
          likesCount: nextLikes[productId]?.likesCount ?? initialCount,
        };

        writeStoredLikes(userKey, nextLikes);
        setIsLiked(isCurrentProductLiked);
        setLikesCount(nextLikes[productId]?.likesCount ?? initialCount);
        setLikesReady(true);
      } catch {
        if (isMounted) {
          setIsLiked(false);
          setLikesReady(true);
        }
      }
    };

    loadLikes();

    return () => {
      isMounted = false;
    };
  }, [initialCount, productId, user, userKey]);

  const toggleLike = async () => {
    if (!productId || !likesReady || likesLoading || toggleLockRef.current) {
      return;
    }

    if (!user) {
      const error = new Error("Please login to like products.");
      error.code = AUTH_REQUIRED_CODE;
      throw error;
    }

    const previousLiked = isLiked;
    const previousCount = likesCount;
    const nextLiked = !previousLiked;
    const nextCount = Math.max(0, previousCount + (previousLiked ? -1 : 1));
    const nextStoredLikes = {
      ...readStoredLikes(userKey),
      [productId]: {
        isLiked: nextLiked,
        likesCount: nextCount,
      },
    };

    setLikesLoading(true);
    toggleLockRef.current = true;
    setIsLiked(nextLiked);
    setLikesCount(nextCount);
    writeStoredLikes(userKey, nextStoredLikes);

    try {
      await productLikeService.toggle(productId);
    } catch (error) {
      const rollbackLikes = {
        ...readStoredLikes(userKey),
        [productId]: {
          isLiked: previousLiked,
          likesCount: previousCount,
        },
      };

      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      writeStoredLikes(userKey, rollbackLikes);
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
    likesReady,
    toggleLike,
    authRequiredCode: AUTH_REQUIRED_CODE,
  };
};
