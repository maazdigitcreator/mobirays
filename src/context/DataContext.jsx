import { useCallback, useEffect, useRef, useState } from "react";
import { bannerService } from "../services/bannerService";
import { filterService } from "../services/filterService";
import { productLikeService } from "../services/productLikeService";
import { wishlistService } from "../services/wishlistService";
import { productService } from "../services/productService";
import { pageService } from "../services/pageService";
import { DataContext } from "./dataContextInstance";

// ─── Cache config ────────────────────────────────────────────────────────────
const CACHE_KEY        = "mr_main_v7";
const STATS_CACHE_KEY  = "mr_stats_v4";
const MAIN_CACHE_TTL   = 10 * 60 * 1000;  // 10 min
const STATS_CACHE_TTL  =  5 * 60 * 1000;  //  5 min

const API = import.meta.env.VITE_API_BASE_URL;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const withRetry = async (fn, retries = 3, base = 1200) => {
  for (let i = 0; i < retries; i++) {
    try { return await fn(); }
    catch (err) {
      const limited = err?.status === 429 || String(err?.message || "").toLowerCase().includes("too many");
      if (limited && i < retries - 1) { await delay(base * (i + 1)); continue; }
      throw err;
    }
  }
};

// Reads cache and returns parsed object or null
const readCache = (key) => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch { return null; }
};

const writeCache = (key, data) => {
  try { sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), ...data })); } catch {}
};

const filterDrafts = (arr) =>
  (arr || []).filter((item) => {
    const s = typeof item.status === "object" ? String(item.status?.value || "") : String(item.status || "");
    return !["draft", "pending", "drafts"].includes(s.trim().toLowerCase());
  });

// Safe fetch — turns HTML error pages into proper errors
const safeFetch = async (url) => {
  const res = await fetch(url);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    throw Object.assign(new Error(res.status === 429 ? "Too Many Attempts." : `Server error (${res.status})`), { status: res.status });
  }
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw Object.assign(new Error(d?.message || `Request failed (${res.status})`), { status: res.status, data: d });
  }
  return res.json();
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const DataProvider = ({ children }) => {
  const [allProducts,   setAllProducts]   = useState([]);
  const [allNews,       setAllNews]       = useState([]);
  const [allReviews,    setAllReviews]    = useState([]);
  const [allBrands,     setAllBrands]     = useState([]);
  const [allBanners,    setAllBanners]    = useState([]);
  const [dynamicPages,  setDynamicPages]  = useState([]);

  const [productLikeTotals,           setProductLikeTotals]           = useState([]);
  const [productLikeTotalsStatus,     setProductLikeTotalsStatus]     = useState({ loading: true, error: "", loaded: false });
  const [productWishlistTotals,       setProductWishlistTotals]       = useState([]);
  const [productWishlistTotalsStatus, setProductWishlistTotalsStatus] = useState({ loading: true, error: "", loaded: false });
  const [productVisitorTotals,        setProductVisitorTotals]        = useState([]);
  const [productVisitorTotalsStatus,  setProductVisitorTotalsStatus]  = useState({ loading: true, error: "", loaded: false });

  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const dataLoadedRef = useRef(false);

  const normalizeVisitorTotals = useCallback((items = []) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => {
      const fb  = item?.product || {};
      const nid = Number(item?.product_id ?? fb?.id ?? item?.id);
      if (!Number.isFinite(nid) || nid <= 0) return null;
      return { id: nid, name: fb?.name || item?.name || "Unknown Product", slug: fb?.slug || item?.slug || null, visited_count: Number(item?.visited_count ?? item?.views ?? 0) };
    }).filter(Boolean);
  }, []);

  // ── fetchAllData ───────────────────────────────────────────────────────────
  const fetchAllData = useCallback(async (force = false) => {
    if (!force && dataLoadedRef.current) return;

    // ── CACHE HIT → instant load ──────────────────────────────────────────
    if (!force) {
      const c = readCache(CACHE_KEY);
      if (c && Date.now() - c.ts < MAIN_CACHE_TTL) {
        setAllProducts(c.products   || []);
        setAllNews(c.news           || []);
        setAllReviews(c.reviews     || []);
        setAllBrands(c.brands       || []);
        setAllBanners(c.banners     || []);
        setDynamicPages(c.dynamicPages || []);
        setLoading(false);
        dataLoadedRef.current = true;
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      // ══════════════════════════════════════════════════════════════════════
      // WAVE 1 — Everything the homepage needs to paint (fire ALL at once)
      //   • Products page 1 with 200 per page  → phones/tabs/watches
      //   • Banners                            → hero slider
      //   • Brands                             → sidebar
      //   • Specialized lists                  → What's New / Coming Soon
      // ══════════════════════════════════════════════════════════════════════
      // Group 1: Essential layout + Latest Phones (highest priority)
      const [
        firstFilterRes, bannersData, brandsRes,
        phoneCS, phoneWN,
      ] = await Promise.all([
        withRetry(() => filterService.applyFilters({ categories: [], page: 1, perPage: 200 })),
        withRetry(() => bannerService.getAllBanners(100)),
        withRetry(() => safeFetch(`${API}/api/v1/brands/allBrands`)),
        withRetry(() => safeFetch(`${API}/api/v1/products/phoneComingsoon`)),
        withRetry(() => safeFetch(`${API}/api/v1/products/phoneWhatsNew`)),
      ]);

      // Group 2: Tabs and Watches (slightly lower priority, delayed to avoid rate limit)
      await delay(400); 

      const [tabletCS, watchCS, tabletWN, watchWN] = await Promise.all([
        withRetry(() => safeFetch(`${API}/api/v1/products/tabletComingsoon`)),
        withRetry(() => safeFetch(`${API}/api/v1/products/watchesComingsoon`)),
        withRetry(() => safeFetch(`${API}/api/v1/products/tabletWhatsNew`)),
        withRetry(() => safeFetch(`${API}/api/v1/products/watchesWhatsNew`)),
      ]);

      const comingSoonIds = new Set([
        ...(phoneCS?.data?.map((p) => p.id)  || []),
        ...(tabletCS?.data?.map((p) => p.id) || []),
        ...(watchCS?.data?.map((p) => p.id)  || []),
      ]);
      const whatsNewIds = new Set([
        ...(phoneWN?.data?.map((p) => p.id)  || []),
        ...(tabletWN?.data?.map((p) => p.id) || []),
        ...(watchWN?.data?.map((p) => p.id)  || []),
      ]);

      // Combine specialized products with first 200 items to ensure "Latest" items are present
      const specializedProducts = [
        ...(phoneCS?.data || []), ...(tabletCS?.data || []), ...(watchCS?.data || []),
        ...(phoneWN?.data || []), ...(tabletWN?.data || []), ...(watchWN?.data || []),
      ];

      // Use a Map to deduplicate by ID
      const initialProductMap = new Map();
      [...(firstFilterRes?.data || []), ...specializedProducts].forEach((p) => {
        if (p && p.id && !initialProductMap.has(p.id)) {
          initialProductMap.set(p.id, p);
        }
      });

      // Paint screen immediately — user sees ALL latest content right away
      const firstProducts = filterDrafts(Array.from(initialProductMap.values())).map((product) => {
        const pt = product.product_type || "";
        return {
          ...product,
          is_coming_soon: comingSoonIds.has(product.id) || product.is_coming_soon === 1 || pt === "Coming Soon",
          is_new:         whatsNewIds.has(product.id)   || product.is_new === 1           || pt === "What's New",
        };
      });

      setAllProducts(firstProducts);
      setAllBanners(bannersData || []);
      setAllBrands(brandsRes?.data || []);
      setLoading(false);  // ← UI unblocked here

      // ══════════════════════════════════════════════════════════════════════
      // WAVE 2 — Secondary content (News, Reviews, Pages)
      // ══════════════════════════════════════════════════════════════════════
      const [newsRes, reviewsRes, pagesData] = await Promise.all([
        withRetry(() => safeFetch(`${API}/api/v1/posts`)),
        withRetry(() => safeFetch(`${API}/api/v1/reviews/allReviews`)),
        withRetry(() => pageService.getAllPages()),
      ]);

      setAllNews(filterDrafts(newsRes?.data));
      setAllReviews(filterDrafts(reviewsRes?.data));
      setDynamicPages(pagesData || []);

      // ══════════════════════════════════════════════════════════════════════
      // WAVE 3 — Remaining product pages (if total > 200)
      // ══════════════════════════════════════════════════════════════════════
      const totalProducts  = Number(firstFilterRes?.meta?.total || 0);
      const BATCH_PER_PAGE = 200;
      const lastPage       = Math.ceil(totalProducts / BATCH_PER_PAGE) || 1;
      let   remainingPages = [];

      if (lastPage > 1) {
        const nums = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
        for (let i = 0; i < nums.length; i += 5) {
          const batch = await Promise.all(
            nums.slice(i, i + 5).map((p) =>
              withRetry(() => filterService.applyFilters({ categories: [], page: p, perPage: BATCH_PER_PAGE }))
            )
          );
          remainingPages.push(...batch);
          await delay(100);
        }
      }

      // ── Enrich + finalize all products ────────────────────────────────────
      const rawAll = [
        ...Array.from(initialProductMap.values()),
        ...remainingPages.flatMap((r) => r.data || []),
      ];

      // Final deduplication (just in case)
      const finalMap = new Map();
      rawAll.forEach(p => { if (p && p.id && !finalMap.has(p.id)) finalMap.set(p.id, p); });

      const products = filterDrafts(Array.from(finalMap.values())).map((product) => {
        const pt = product.product_type || "";
        return {
          ...product,
          is_coming_soon: comingSoonIds.has(product.id) || product.is_coming_soon === 1 || pt === "Coming Soon",
          is_new:         whatsNewIds.has(product.id)   || product.is_new === 1           || pt === "What's New",
        };
      });

      const news    = filterDrafts(newsRes?.data);
      const reviews = filterDrafts(reviewsRes?.data);
      const brands  = brandsRes?.data || [];
      const banners = bannersData || [];
      const pages   = pagesData   || [];

      setAllProducts(products);
      setAllNews(news);
      setAllReviews(reviews);
      setAllBrands(brands);
      setAllBanners(banners);
      setDynamicPages(pages);
      dataLoadedRef.current = true;

      writeCache(CACHE_KEY, { products, news, reviews, brands, banners, dynamicPages: pages });

    } catch (err) {
      console.error("fetchAllData error:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // ── loadStats ──────────────────────────────────────────────────────────────
  // Stats (likes/visitors/wishlist) fire after Wave 2 settles.
  // They have their own 5-min cache so repeat visits are instant.
  const loadStats = useCallback(async () => {
    const c = readCache(STATS_CACHE_KEY);
    if (c && Date.now() - c.ts < STATS_CACHE_TTL) {
      if (c.likes)    { setProductLikeTotals(c.likes);    setProductLikeTotalsStatus({ loading: false, error: "", loaded: true }); }
      if (c.visitors) { setProductVisitorTotals(normalizeVisitorTotals(c.visitors)); setProductVisitorTotalsStatus({ loading: false, error: "", loaded: true }); }
      if (c.wishlist) { setProductWishlistTotals(c.wishlist); setProductWishlistTotalsStatus({ loading: false, error: "", loaded: true }); }
      return;
    }

    // Give Wave 1+2 time to complete before hitting server with stats requests
    await delay(3500);

    const saved = { likes: null, visitors: null, wishlist: null };

    try {
      const likes = await withRetry(() => productLikeService.getAllTotalLikes(), 4, 1200);
      saved.likes = likes;
      setProductLikeTotals(likes);
      setProductLikeTotalsStatus({ loading: false, error: "", loaded: true });
    } catch (err) {
      setProductLikeTotalsStatus({ loading: false, error: err?.data?.message || err?.message || "Failed to load device likes.", loaded: false });
    }

    await delay(600);

    try {
      const vRes = await withRetry(() => productService.getProductVisitors(), 4, 1200);
      saved.visitors = vRes?.data;
      setProductVisitorTotals(normalizeVisitorTotals(vRes?.data));
      setProductVisitorTotalsStatus({ loading: false, error: "", loaded: true });
    } catch (err) {
      setProductVisitorTotalsStatus({ loading: false, error: err?.data?.message || err?.message || "Failed to load device visitors.", loaded: false });
    }

    await delay(600);

    try {
      const wishlist = await withRetry(() => wishlistService.getAllTotalWishlist(), 4, 1200);
      saved.wishlist = wishlist;
      setProductWishlistTotals(wishlist);
      setProductWishlistTotalsStatus({ loading: false, error: "", loaded: true });
    } catch (err) {
      setProductWishlistTotalsStatus({ loading: false, error: err?.data?.message || err?.message || "Failed to load wishlist totals.", loaded: false });
    }

    writeCache(STATS_CACHE_KEY, saved);
  }, [normalizeVisitorTotals]);

  useEffect(() => {
    fetchAllData();
    loadStats();
  }, [fetchAllData, loadStats]);

  // ── Updaters ───────────────────────────────────────────────────────────────
  const setProductLikeTotalCount = useCallback((productId, likesCount) => {
    const nid = Number(productId);
    setProductLikeTotals((c) => c.map((p) => Number(p.id) === nid ? { ...p, likes_count: Number(likesCount) } : p));
  }, []);

  const setProductWishlistTotalCount = useCallback((productId, count) => {
    const nid = Number(productId);
    setProductWishlistTotals((c) => c.map((p) => Number(p.id) === nid ? { ...p, wishlist_count: Number(count) } : p));
  }, []);

  const setProductVisitorTotalCount = useCallback((productId, visitedCount, name, slug) => {
    const nid = Number(productId);
    if (!Number.isFinite(nid) || nid <= 0) return;
    setProductVisitorTotals((c) => {
      const idx = c.findIndex((p) => Number(p.id) === nid);
      const next = Number(visitedCount);
      const cnt  = Number.isFinite(next) ? next : idx >= 0 ? Number(c[idx]?.visited_count || 0) + 1 : 1;
      if (idx === -1) return [...c, { id: nid, name: name || "Unknown Product", slug: slug || null, visited_count: cnt }];
      return c.map((p, i) => i === idx ? { ...p, name: name || p.name, slug: slug || p.slug || null, visited_count: cnt } : p);
    });
  }, []);

  return (
    <DataContext.Provider value={{
      allProducts, allNews, allReviews, allBrands, allBanners, dynamicPages,
      productLikeTotals,     productLikeTotalsStatus,
      productWishlistTotals, productWishlistTotalsStatus,
      productVisitorTotals,  productVisitorTotalsStatus,
      loading, error,
      refreshData: () => fetchAllData(true),
      setProductLikeTotalCount,
      setProductWishlistTotalCount,
      setProductVisitorTotalCount,
    }}>
      {children}
    </DataContext.Provider>
  );
};
