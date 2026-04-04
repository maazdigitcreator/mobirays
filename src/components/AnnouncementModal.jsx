import React from "react";
import { X } from "lucide-react";

/**
 * AnnouncementModal component.
 * Displays catchy announcement content in a modal.
 */
const AnnouncementModal = ({ announcement, onClose, isOpen }) => {
  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[700px] h-auto sm:h-[90%] max-h-[90vh] overflow-y-auto sm:overflow-hidden bg-white shadow-2xl transition-all duration-300 animate-in fade-in zoom-in flex flex-col">
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#0580A5] to-[#046a8a]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors z-20 cursor-pointer bg-white/90 rounded-full shadow-sm hover:shadow-md"
          aria-label="Close Announcement"
        >
          <X size={20} />
        </button>

        {/* Content Area */}
        <div className="p-3 sm:p-5 w-full flex flex-col items-center">
          {announcement.name && (
            <h2 className="text-lg sm:text-xl font-bold text-[#0580A5] mb-3 text-center uppercase tracking-wide">
              {announcement.name}
            </h2>
          )}

          <div className="announcement-content w-full flex justify-center text-gray-700 leading-relaxed">
            <div
              className="w-full [&_img]:w-full [&_img]:h-auto [&_img]:block [&_img]:max-h-[70vh] [&_img]:object-contain"
              dangerouslySetInnerHTML={{ __html: announcement.content }}
            />
          </div>
        </div>


      </div>
    </div>
  );
};

export default AnnouncementModal;
