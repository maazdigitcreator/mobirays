import { useState } from "react";
import { X } from "lucide-react";

const EditReviewModal = ({ review, status, onClose, onSubmit }) => {
  const [title, setTitle] = useState(review.title);
  const [content, setContent] = useState(review.reviewText);
  const [rating, setRating] = useState(review.rating);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, rating });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-white">
        <div className="flex items-center justify-between bg-[#0580A5] px-4 py-3">
          <h2 className="text-white text-lg">Edit Review</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {status.error && (
            <div className="border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700">
              {status.error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#0580A5]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className={`text-2xl transition-colors ${star <= (hoveredStar || rating) ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Review
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              className="border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#0580A5] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={status.loading}
              className="px-4 py-2 text-sm border-2 border-gray-300 text-gray-600 hover:border-gray-400 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status.loading}
              className="px-4 py-2 text-sm bg-[#0580A5] text-white hover:bg-[#046a8a] disabled:opacity-50"
            >
              {status.loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReviewModal;
