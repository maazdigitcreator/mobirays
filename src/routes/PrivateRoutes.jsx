import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Wishlist from "../pages/Wishlist";
import LikedProducts from "../pages/LikedProducts";
import ReviewedProducts from "../pages/ReviewedProducts";
import AdminReviewReplies from "../pages/AdminReviewReplies";
import NewsReviewReplies from "../pages/NewsReviewReplies";

const privateRoutes = (
  <>
    <Route
      path="/wishlist"
      element={
        <ProtectedRoute>
          <Wishlist />
        </ProtectedRoute>
      }
    />
    <Route
      path="/liked-products"
      element={
        <ProtectedRoute>
          <LikedProducts />
        </ProtectedRoute>
      }
    />
    <Route
      path="/reviewed-products"
      element={
        <ProtectedRoute>
          <ReviewedProducts />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin-review-replies"
      element={
        <ProtectedRoute>
          <AdminReviewReplies />
        </ProtectedRoute>
      }
    />
    <Route
      path="/news-review-replies"
      element={
        <ProtectedRoute>
          <NewsReviewReplies />
        </ProtectedRoute>
      }
    />
  </>
);

export default privateRoutes;
