import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Wishlist from '../pages/Wishlist';
import LikedProducts from '../pages/LikedProducts';
import ReviewedProducts from '../pages/ReviewedProducts';

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
  </>
);

export default privateRoutes;
