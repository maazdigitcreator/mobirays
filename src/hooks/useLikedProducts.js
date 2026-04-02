import { useEffect, useMemo, useState } from "react";
import { useData } from "../context/useData";
import { productLikeService } from "../services/productLikeService";
import {
  getProductLikeErrorMessage,
  normalizeLikedProduct,
} from "../utils/productLike";

const ITEMS_PER_PAGE = 12;

export const useLikedProducts = (products) => {
  const { allProducts } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedLikes, setFetchedLikes] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      return;
    }

    let isMounted = true;

    const fetchLikes = async () => {
      setStatus({
        loading: true,
        error: "",
      });

      try {
        const likedItems = await productLikeService.getAllLikes();

        if (!isMounted) {
          return;
        }

        setFetchedLikes(likedItems);
        setStatus({
          loading: false,
          error: "",
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setFetchedLikes([]);
        setStatus({
          loading: false,
          error: getProductLikeErrorMessage(error),
        });
      }
    };

    fetchLikes();

    return () => {
      isMounted = false;
    };
  }, [products]);

  const rawLikes = useMemo(() => {
    if (Array.isArray(products) && products.length > 0) {
      return products;
    }

    return fetchedLikes;
  }, [fetchedLikes, products]);

  const productsById = useMemo(
    () => new Map(allProducts.map((product) => [Number(product.id), product])),
    [allProducts],
  );

  const likedProducts = useMemo(
    () =>
      rawLikes.map((like) =>
        normalizeLikedProduct(
          like,
          productsById.get(Number(like?.product)) || null,
        ),
      ),
    [productsById, rawLikes],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return likedProducts;
    }

    return likedProducts.filter((product) =>
      product.name.toLowerCase().includes(normalizedQuery),
    );
  }, [likedProducts, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const resolvedCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const indexOfLastItem = resolvedCurrentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  return {
    currentPage: resolvedCurrentPage,
    currentProducts,
    searchQuery,
    status,
    totalPages,
    handleSearchChange,
    setCurrentPage,
  };
};
