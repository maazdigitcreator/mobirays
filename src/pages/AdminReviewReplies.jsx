import React from "react";
import DashboardPageLayout from "../components/DashboardPageLayout";
import DashboardReviewRepliesList from "../components/DashboardReviewRepliesList";
import { useAdminReviewReplies } from "../hooks/useAdminReviewReplies";

const AdminReviewReplies = () => {
  const {
    currentReplies,
    currentPage,
    searchQuery,
    status,
    totalPages,
    setCurrentPage,
    handleSearchChange,
  } = useAdminReviewReplies();

  return (
    <DashboardPageLayout>
      <DashboardReviewRepliesList
        title="Admin Review Replies"
        currentReplies={currentReplies}
        currentPage={currentPage}
        totalPages={totalPages}
        status={status}
        searchQuery={searchQuery}
        setCurrentPage={setCurrentPage}
        handleSearchChange={handleSearchChange}
        emptyMessage="No admin review replies found."
      />
    </DashboardPageLayout>
  );
};

export default AdminReviewReplies;
