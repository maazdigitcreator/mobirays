import React from "react";
import { useNavigate } from "react-router-dom";
import MobileImg from "../assets/mobileImg.jpg";
import { Search, Edit, Trash2 } from "lucide-react";
import Pagination from "./Pagination";
import { useReviewedProducts } from "../hooks/useReviewedProducts";
import EditReviewModal from "./EditReviewModal";
import { getProductDetailPath } from "../utils/productRoutes";

const ReviewedProductsList = ({
  title = "Reviewed Products",
  products,
  itemImage,
}) => {
  const navigate = useNavigate();
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

  const handleProductClick = (product) => {
    if (!product) return;

    navigate(getProductDetailPath(product), {
      state: {
        product: product,
      },
    });
  };

  return (
    <div className="w-full container">
      <div>
        {/* Desktop & Mobile Responsive Header */}
        <div className="w-full mb-9">
            {/* DESKTOP LAYOUT */}
            <div className="hidden sm:flex relative w-full h-14 items-center justify-between overflow-hidden">
                {/* Full width blue line */}
                <div className="absolute -bottom-1 left-0 w-full h-[16px] bg-[#0580A5]"></div>

                <div className="relative flex items-end">
                    <div className="latest-products-clip bg-[#0580A5] text-white w-fit h-14 flex items-center relative z-10">
                        <h1 className="text-[26px] pl-4 pr-6">{title}</h1>
                    </div>
                </div>

                <div className="flex z-10 mb-4 items-start pr-0">
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-[350px] border-2 border-[#0580A5] py-1 px-3 focus:outline-none focus:border-[#046a8a] text-black placeholder-gray-500"
                        />
                        <button
                            type="button"
                            className="px-4 bg-[#0580A5] hover:bg-[#046a8a] transition-colors flex items-center justify-center"
                        >
                            <Search className="text-white" size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE LAYOUT */}
            <div className="flex sm:hidden flex-col-reverse gap-4">
                <div className="relative w-full h-10 overflow-hidden">
                    {/* Mobile full width blue line */}
                    <div className="absolute -bottom-1 left-0 w-full h-[12px] bg-[#0580A5]"></div>

                    <div className="latest-products-clip bg-[#0580A5] text-white w-fit h-10 flex items-center relative z-10">
                        <h1 className="text-[18px] pl-2 pr-6">{title}</h1>
                    </div>
                </div>

                <div className="flex w-full z-10">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="flex-1 w-full border-2 border-[#0580A5] py-1.5 px-3 focus:outline-none focus:border-[#046a8a] text-black placeholder-gray-500"
                    />
                    <button
                        type="button"
                        className="px-4 bg-[#0580A5] hover:bg-[#046a8a] transition-colors flex items-center justify-center"
                    >
                        <Search className="text-white" size={20} />
                    </button>
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
        <div className="flex flex-col gap-6 px-0 sm:px-2">
          {currentReviews.map((review) => (
            <div
              key={review.id}
              className="flex md:flex-row sm:gap-6 gap-1 items-start"
            >
              {/* Left Side: Product Image and Name */}
              <div
                className="sm:w-full w-[25%] md:w-1/4 flex flex-col group cursor-pointer"
                onClick={() => handleProductClick(review.product)}
              >
                <div className="relative mb-3 flex justify-center items-center p-2 rounded-lg h-auto transition-transform group-hover:scale-105">
                  <div className="w-full h-full flex items-start justify-center text-6xl">
                    <img
                      src={review.productImage || itemImage || MobileImg}
                      alt={review.productName}
                    />
                  </div>
                </div>
                <h3 className="sm:text-[18px] leading-tight uppercase text-[#1E1E1E] line-clamp-2 text-center overflow-hidden px-2 sm:px-5">
                  {review.productName}
                </h3>
              </div>

              {/* Right Side: Review Content */}
              <div className="w-full md:w-3/4 border-1 sm:border-2 border-[#0580A5] sm:p-4 p-2 relative">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="sm:text-2xl text-xl font-normal text-black">
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

                <div className="absolute bottom-2 sm:bottom-4 right-4 flex items-center gap-4 sm:text-base text-sm">
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
