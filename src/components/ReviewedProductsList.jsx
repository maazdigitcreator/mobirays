import MobileImg from "../assets/mobileImg.jpg";
import { Search, Edit, Trash2 } from "lucide-react";
import Pagination from "./Pagination";
import { useReviewedProducts } from "../hooks/useReviewedProducts";
import EditReviewModal from "./EditReviewModal";

const ReviewedProductsList = ({
  title = "Reviewed Products",
  products,
  itemImage,
}) => {
  const {
    status,
    totalPages,
    currentPage,
    searchQuery,
    currentReviews,
    setCurrentPage,
    handleSearchChange,
    editingReview,
    editStatus,
    handleEditOpen,
    handleEditClose,
    handleEditSubmit,
    deletingId,
    handleDelete,
  } = useReviewedProducts(products);

  return (
    <div className="w-full container">
      <div>
        <div className="relative w-full mb-9 overflow-hidden">
          {/* Background bar */}
          <div className="w-full h-10 sm:h-14 flex items-center justify-between">
            {/* Left side - Device name with slanted edge */}
            <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

            <div className="relative w-full flex items-end">
              {/* Title Box */}
              <div className="latest-products-clip bg-[#0580A5] text-white w-fit sm:h-14 h-10 flex items-center relative z-10">
                <h1 className="sm:text-[26px] text-[18px] pl-2 sm:pl-4">
                  {title}
                </h1>
              </div>
            </div>

            {/* Right side */}
            <div className="flex gap-20 mb-4 justify-start items-start ">
              {/* Search Bar */}
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full sm:w-[400px] border-2 border-[#0580A5] py-1 px-2 focus:outline-none focus:border-[#046a8a] text-black placeholder-gray-500"
                />
                <button
                  type="button"
                  className="right-0 top-0 min-h-full px-4 bg-[#0580A5] hover:bg-[#046a8a] transition-colors flex items-center justify-center"
                >
                  <Search className="text-white" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {status.error && (
        <div className="mb-6 border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
          {status.error}
        </div>
      )}

      {status.loading ? (
        <div className="py-10 text-center text-gray-500">
          Loading reviewed products...
        </div>
      ) : currentReviews.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          {searchQuery
            ? `No reviewed products found for "${searchQuery}".`
            : "No reviewed products found."}
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-2 sm:px-0">
          {currentReviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Left Side: Product Image and Name */}
              <div className="w-full md:w-1/4 flex flex-col group cursor-pointer">
                <div className="relative mb-3 flex justify-center items-center p-2 bg-blue-50/50 rounded-lg h-48 transition-transform group-hover:scale-105">
                  <div className="w-full h-full flex items-center justify-center text-6xl text-blue-200">
                    <img
                      src={review.productImage || itemImage || MobileImg}
                      alt={review.productName}
                    />
                  </div>
                </div>
                <h3 className="text-[18px] leading-tight uppercase text-[#1E1E1E] line-clamp-2 text-center overflow-hidden px-5">
                  {review.productName}
                </h3>
              </div>

              {/* Right Side: Review Content */}
              <div className="w-full md:w-3/4 border-2 border-[#0580A5] p-4 relative">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-normal text-black">
                    {review.title}
                  </h3>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-black flex items-center gap-1 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-clock"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {review.date}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-black font-bold mb-4">
                  {review.author}
                </p>

                <p className="text-sm text-black leading-relaxed mb-8">
                  {review.reviewText}
                </p>

                <div className="absolute bottom-4 right-4 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleEditOpen(review)}
                    className="text-[#0580A5] font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Edit size={16} /> Edit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    className="text-[#0580A5] font-semibold flex items-center gap-1 cursor-pointer hover:underline disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    {deletingId === review.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {editingReview && (
        <EditReviewModal
          review={editingReview}
          status={editStatus}
          onClose={handleEditClose}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default ReviewedProductsList;
