import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileImg from '../assets/mobileImg.jpg'
import { createSlug } from '../utils/urlHelper'
import { Search, Edit, Trash2 } from 'lucide-react'
import Pagination from './Pagination'

const ReviewedProductsList = ({ title = "Reviewed Products", products, itemImage }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Dummy Data for Logic - Replace with API Call
    const dummyReviews = [
        {
            id: 1,
            productName: "Samsung Galaxy Note 20",
            productImage: null, // Use default or passed image
            author: "John Doe ( 9 July 29) on Amazon",
            date: "12 Hours Ago",
            rating: 5,
            reviewText: "I have been using SAMSUNG products nearly for 12-14 years and above. None of them gave any issues. Brought Samsung A51 this phone on 07th of July 2020 near my residence in 6 equity monthly installment scheme. Few of the application was outdated and post switching on, I had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current requirements. Thanks & Regards, John Doe."
        },
        {
            id: 2,
            productName: "XIOMI POCO F2 PRO",
            productImage: null,
            author: "John Doe ( 9 July 29) on Amazon",
            date: "12 Hours Ago",
            rating: 4,
            reviewText: "I have been using SAMSUNG products nearly for 12-14 years and above. None of them gave any issues. Brought Samsung A51 this phone on 07th of July 2020 near my residence in 6 equity monthly installment scheme. Few of the application was outdated and post switching on, I had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current requirements. Thanks & Regards, John Doe."
        },
        {
            id: 3,
            productName: "Samsung Galaxy S20",
            productImage: null,
            author: "Jane Smith ( 10 July 29) on Flipkart",
            date: "1 Day Ago",
            rating: 5,
            reviewText: "I have been using SAMSUNG products nearly for 12-14 years and above. None of them gave any issues. Brought Samsung A51 this phone on 07th of July 2020 near my residence in 6 equity monthly installment scheme. Few of the application was outdated and post switching on, I had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current requirements. Thanks & Regards, John Doe."
        },
        {
            id: 4,
            productName: "Samsung Galaxy Note 20",
            productImage: null, // Use default or passed image
            author: "John Doe ( 9 July 29) on Amazon",
            date: "12 Hours Ago",
            rating: 5,
            reviewText: "I have been using SAMSUNG products nearly for 12-14 years and above. None of them gave any issues. Brought Samsung A51 this phone on 07th of July 2020 near my residence in 6 equity monthly installment scheme. Few of the application was outdated and post switching on, I had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current requirements. Thanks & Regards, John Doe."
        },
        {
            id: 5,
            productName: "XIOMI POCO F2 PRO",
            productImage: null,
            author: "John Doe ( 9 July 29) on Amazon",
            date: "12 Hours Ago",
            rating: 4,
            reviewText: "I have been using SAMSUNG products nearly for 12-14 years and above. None of them gave any issues. Brought Samsung A51 this phone on 07th of July 2020 near my residence in 6 equity monthly installment scheme. Few of the application was outdated and post switching on, I had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current requirements. Thanks & Regards, John Doe."
        },
        {
            id: 6,
            productName: "Samsung Galaxy S20",
            productImage: null,
            author: "Jane Smith ( 10 July 29) on Flipkart",
            date: "1 Day Ago",
            rating: 5,
            reviewText: "I have been using SAMSUNG products nearly for 12-14 years and above. None of them gave any issues. Brought Samsung A51 this phone on 07th of July 2020 near my residence in 6 equity monthly installment scheme. Few of the application was outdated and post switching on, I had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current requirements. Thanks & Regards, John Doe."
        }
    ];

    const allReviews = products || dummyReviews;

    // Logic for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReviews = allReviews.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(allReviews.length / itemsPerPage);

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
                            <div
                                className="latest-products-clip bg-[#0580A5] text-white w-fit sm:h-14 h-10 flex items-center relative z-10"
                            >
                                <h1 className="sm:text-[26px] text-[18px] pl-2 sm:pl-4">{title}</h1>
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
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-[400px] border-2 border-[#0580A5] py-1 px-2 focus:outline-none focus:border-[#046a8a] text-black placeholder-gray-500"
                                />
                                <button className=" right-0 top-0 min-h-full px-4 bg-[#0580A5] hover:bg-[#046a8a] transition-colors flex items-center justify-center">
                                    <Search className="text-white" size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 px-2 sm:px-0">
                {currentReviews.map((review) => (
                    <div key={review.id} className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Left Side: Product Image and Name */}
                        <div className="w-full md:w-1/4 flex flex-col group cursor-pointer">
                            <div className="relative mb-3 flex justify-center items-center p-2 bg-blue-50/50 rounded-lg h-48 transition-transform group-hover:scale-105">
                                <div className="w-full h-full flex items-center justify-center text-6xl text-blue-200">
                                    <img src={review.productImage || itemImage || MobileImg} alt="" />
                                </div>
                            </div>
                            <h3 className="text-[18px] leading-tight uppercase text-[#1E1E1E] line-clamp-2 text-center overflow-hidden px-5">
                                {review.productName}
                            </h3>
                        </div>

                        {/* Right Side: Review Content */}
                        <div className="w-full md:w-3/4 border-2 border-[#0580A5] p-4 relative">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-2xl font-normal text-black">{review.productName}</h3>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                        ))}
                                    </div>
                                    <span className="text-xs text-black flex items-center gap-1 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        {review.date}
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm text-black font-bold mb-4">{review.author}</p>

                            <p className="text-sm text-black leading-relaxed mb-8">
                                {review.reviewText}
                            </p>

                            <div className="absolute bottom-4 right-4 flex items-center gap-4">
                                <button className="text-[#0580A5] font-semibold flex items-center gap-1 cursor-pointer hover:underline">
                                    <Edit size={16} /> Edit Review
                                </button>
                                <button className="text-[#0580A5] font-semibold flex items-center gap-1 cursor-pointer hover:underline">
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

export default ReviewedProductsList;
