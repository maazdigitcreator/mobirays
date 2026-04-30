import React from "react";
import { Link } from "react-router-dom";
import { Edit, Search, Trash2 } from "lucide-react";
import Pagination from "./Pagination";
import reviewImg from "../assets/reviewsImg.png";
import EditReviewModal from "./EditReviewModal";

const DashboardReviewRepliesList = ({
  title,
  currentReplies,
  currentPage,
  totalPages,
  status,
  searchQuery,
  setCurrentPage,
  handleSearchChange,
  emptyMessage,
  editingReply,
  editStatus,
  handleEditOpen,
  handleEditClose,
  handleEditSubmit,
  deletingId,
  handleDelete,
  basePath = "review",
}) => {
  const sectionRef = React.useRef(null);
  return (
    <div className="w-full container" ref={sectionRef}>
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

      {status.error && (
        <div className="mb-6 border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
          {status.error}
        </div>
      )}

      {status.loading ? (
        <div className="py-10 text-center text-gray-500">
          Loading replies...
        </div>
      ) : currentReplies.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          {searchQuery
            ? `No replies found for "${searchQuery}".`
            : emptyMessage}
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-0 sm:px-2">
          {currentReplies.map((reply) => (
            <div
              key={reply.id}
              className="flex md:flex-row sm:gap-6 gap-1 items-start"
            >
              <div className="sm:w-full w-[25%] md:w-1/4 flex flex-col group">
                <Link
                  to={
                    reply.subjectSlug
                      ? `/${basePath}/${reply.subjectSlug}`
                      : `/${basePath}s`
                  }
                  className="relative mb-3 flex justify-center items-center p-2 rounded-lg h-auto transition-transform group-hover:scale-105"
                >
                  <div className="w-full h-full flex items-start justify-center text-6xl">
                    <img
                      src={reply.subjectImage || reviewImg}
                      alt={reply.subjectName}
                      className="max-h-full object-contain"
                    />
                  </div>
                </Link>
                <h3 className="sm:text-[18px] leading-tight uppercase text-[#1E1E1E] line-clamp-2 text-center text-xs text-start overflow-hidden px-2 sm:px-5">
                  {reply.subjectName}
                </h3>
              </div>

              <div className="w-full md:w-3/4 border-1 sm:border-2 border-[#0580A5] sm:p-4 p-2 relative">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="sm:text-2xl text-xl font-normal text-black">
                    {reply.title}
                  </h3>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${i < reply.rating ? "text-yellow-400" : "text-gray-300"}`}
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
                      {reply.date}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-black font-bold mb-4">
                  {reply.author}
                </p>

                <p className="text-sm text-black leading-relaxed mb-8">
                  {reply.content}
                </p>

                <div className="absolute bottom-2 sm:bottom-4 right-4 flex items-center gap-4 sm:text-base text-sm">
                  <button
                    type="button"
                    onClick={() => handleEditOpen(reply)}
                    className="text-[#0580A5] font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Edit size={16} /> Edit Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(reply.id)}
                    disabled={deletingId === reply.id}
                    className="text-[#0580A5] font-semibold flex items-center gap-1 cursor-pointer hover:underline disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    {deletingId === reply.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          scrollTargetRef={sectionRef}
        />
      )}

      {editingReply && (
        <EditReviewModal
          review={editingReply}
          status={editStatus}
          onClose={handleEditClose}
          onSubmit={handleEditSubmit}
          heading="Edit Reply"
          contentLabel="Reply"
        />
      )}
    </div>
  );
};

export default DashboardReviewRepliesList;
