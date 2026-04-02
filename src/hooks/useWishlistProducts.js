import { useEffect, useMemo, useState } from "react";
import { useData } from "../context/useData";
import { wishlistService } from "../services/wishlistService";
import {
  getProductWishlistErrorMessage,
  normalizeWishlistProduct,
} from "../utils/productWishlist";

const ITEMS_PER_PAGE = 12;

export const useWishlistProducts = (products) => {
  const { allProducts } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedWishlist, setFetchedWishlist] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      return;
    }

    let isMounted = true;

    const fetchWishlist = async () => {
      setStatus({
        loading: true,
        error: "",
      });

      try {
        const wishlistItems = await wishlistService.getAllWishlist();

        if (!isMounted) {
          return;
        }

        setFetchedWishlist(wishlistItems);
        setStatus({
          loading: false,
          error: "",
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setFetchedWishlist([]);
        setStatus({
          loading: false,
          error: getProductWishlistErrorMessage(error),
        });
      }
    };

    fetchWishlist();

    return () => {
      isMounted = false;
    };
  }, [products]);

  const rawWishlist = useMemo(() => {
    if (Array.isArray(products) && products.length > 0) {
      return products;
    }

    return fetchedWishlist;
  }, [fetchedWishlist, products]);

  const productsById = useMemo(
    () => new Map(allProducts.map((product) => [Number(product.id), product])),
    [allProducts],
  );

  const wishlistProducts = useMemo(
    () =>
      rawWishlist.map((item) =>
        normalizeWishlistProduct(
          item,
          productsById.get(Number(item?.product)) || null,
        ),
      ),
    [productsById, rawWishlist],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return wishlistProducts;
    }

    return wishlistProducts.filter((product) =>
      product.name.toLowerCase().includes(normalizedQuery),
    );
  }, [wishlistProducts, searchQuery]);

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
