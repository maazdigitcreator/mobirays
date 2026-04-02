import React from "react";
import DashboardPageLayout from "../components/DashboardPageLayout";
import DashboardReviewRepliesList from "../components/DashboardReviewRepliesList";
import { useNewsReviewReplies } from "../hooks/useNewsReviewReplies";

const NewsReviewReplies = () => {
  const {
    currentReplies,
    currentPage,
    searchQuery,
    status,
    totalPages,
    setCurrentPage,
    handleSearchChange,
    editingReply,
    editStatus,
    handleEditOpen,
    handleEditClose,
    handleEditSubmit,
    deletingId,
    handleDelete,
  } = useNewsReviewReplies();

  return (
    <DashboardPageLayout>
      <DashboardReviewRepliesList
        title="News Review Replies"
        currentReplies={currentReplies}
        currentPage={currentPage}
        totalPages={totalPages}
        status={status}
        searchQuery={searchQuery}
        setCurrentPage={setCurrentPage}
        handleSearchChange={handleSearchChange}
        emptyMessage="No news reviews found."
        editingReply={editingReply}
        editStatus={editStatus}
        handleEditOpen={handleEditOpen}
        handleEditClose={handleEditClose}
        handleEditSubmit={handleEditSubmit}
        deletingId={deletingId}
        handleDelete={handleDelete}
        basePath="news"
      />
    </DashboardPageLayout>
  );
};

export default NewsReviewReplies;
