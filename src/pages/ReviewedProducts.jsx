import React from "react";
import DashboardPageLayout from "../components/DashboardPageLayout";
import ReviewedProductsList from "../components/ReviewedProductsList";

const ReviewedProducts = () => {
  return (
    <DashboardPageLayout>
      <ReviewedProductsList />
    </DashboardPageLayout>
  );
};

export default ReviewedProducts;
